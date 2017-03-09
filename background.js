chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "port");
  this.prevWasAd = false;
  var self = this;
  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (details.url.includes('adeventtracker') || details.url.includes('cloudfront') || details.url.includes('shrt')) {
      self.prevWasAd = true;
      port.postMessage({message: "Ad detected."});
      console.log("Ad detected: " + details.url);
    }
    else if (details.url.includes('api.spotify') && self.prevWasAd) {
      self.prevWasAd = false;
      port.postMessage({message: "Unmute."});
      console.log("Getting track from API: " + details.url);
    }
    else if (details.url.includes('audio-fa') || details.url.includes('api.spotify')) {
      console.log("Audio stream/api call: " + details.url);
    }
  },{urls: ["<all_urls>"]});
});
