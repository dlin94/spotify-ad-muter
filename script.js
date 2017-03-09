var port = chrome.runtime.connect({name: "port"});
port.onMessage.addListener(function(msg) {
  if (msg.message == "Ad detected.") {
    var volume;
    var classes = ["spoticon-volume-onewave-16 control-button",
                   "spoticon-volume-twowave-16 control-button",
                   "spoticon-volume-16 control-button"];
    for (var i = 0; i < 3; i++) {
      if ((volume = document.getElementsByClassName(classes[i])[0]) != undefined) {
        console.log(classes[i]);
        console.log(volume);
        volume.click();
        console.log("Muting!");
        break;
      }
    }
  }
  else if (msg.message == "Unmute.") {
    var volume = document.getElementsByClassName("spoticon-volume-off-16 control-button")[0]
    volume.click();
    console.log("Unmuting!");
  }
});
