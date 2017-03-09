chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "port");
  this.prevWasAd = false;
  this.time = 0;
  var self = this;
  port.postMessage({message:"Hello!"});

  port.onDisconnect.addListener(function() {
    console.log("Disconnecting port.");
  });

  port.onMessage.addListener(function(msg) {
    if (msg.message == "Hi!")
      port.postMessage({message: "Hello!"});
  });

  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if ((details.url.includes('adeventtracker') ||
      details.url.includes('shrt') ||
      (details.url.includes('cloudfront') && details.url.includes('mp3'))) &&
      !self.prevWasAd) {
      self.prevWasAd = true;
      self.time = Date.now();
      port.postMessage({message: "Ad detected."});
      console.log("Ad detected: " + details.url);
    }
    else if ((details.url.includes('api.spotify.com/v1/tracks') && self.prevWasAd)) {
      self.prevWasAd = false;
      port.postMessage({message: "Unmute."});
      console.log("Getting track from API: " + details.url);
    }
    else if (details.url.includes('audio-fa')) {
      if (self.prevWasAd) {
        setTimeout(function() {
          self.prevWasAd = false;
          port.postMessage({message: "Unmute."});
        }, 9500);
      }
      console.log("Audio stream: " + details.url);
    }
  },{urls: ["<all_urls>"]});
});
