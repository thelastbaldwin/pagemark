// contentscript.js can access contents of current page
var storage = chrome.storage.local;

$(document).ready(function(){

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
});





// -- below is rough code for hanling the extension dom objects -- ??

// var goto = document.getElementById("goto");
// var store = document.getElementById("store");
// var clear = document.getElementById("clear");



// goto.onclick = function(){
// 	//Go to last page mark
// 	//If there is a mark saved, go to it
// 	//Otherwise, store the mark. This method should be 
// 	//replaced with the button click and the popup removed.
	
// 	//window.location returns chrome-extension://bicgdlgipmmdbngejbjockomeeaonolc/popup.html
// 	//get this communicated from the real page?
// 	// alert(chrome.extension.getBackgroundPage());
// 	// alert(chrome.tabs.getCurrent(function(){}));
// 	console.log(chrome.tabs.getSelected(null,function(tab){
// 		console.log(tab);
// 		//alert("here");
// 	}));
// }

// var getMark = function(){
// 	console.log("here");
// }

// store.onclick = function(){
// 	alert("store section");
// }

// //move the clear to a context option
// clear.onclick = function(){
// 	alert("clear section");
// }

//Todo: context option to clear all pagemarks 
