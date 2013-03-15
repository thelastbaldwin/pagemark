// contentscript.js can access contents of current page
var storage = chrome.storage.local;

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    //handle message types. Message requires a type value
  	if(request.type==="getInfo"){
  		//get the current scroll positions
  		sendResponse({type: "pagePosition", 
  			pageYOffset: window.pageYOffset, 
  			url: window.location.toString()});

  		console.log(window.pageYOffset);
  		console.log(window.location.toString());
  	}
  	if(request.type==="setPosition"){
  		//requires x and y values
  		window.scrollTo(request.x, request.y);
  	}
 });
