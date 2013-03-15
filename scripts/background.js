//this extension just needs to listen to the icon click
//event and tell the content script to send the popup
//some info about the page
var storage = chrome.storage.local;

chrome.browserAction.setIcon({path: "icon.png"},function(){
});

console.log("background.js loaded");

var pageInfo = {
	yPosition: 0,
	xPosition: 0, //just leave this as 0 for now
	url: ''
}

var savedPosition;

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	console.log(sender.tab ?
	        "from a content script:" + sender.tab.url :
	        "from the extension");
	//handle different types of messagess
	if(request.type="pagePosition"){
		//debug. remove later
		console.log(request.pageYOffset,request.url);
		pageInfo.yPosition = request.pageYOffset;
		pageInfo.url = request.url;
	}
	else if(request.type="fetchPosition"){
		getPageInfo();
	}
});

function getPageInfo(){
	chrome.tabs.getSelected(null, function(tab) {
		console.log(tab);
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
	  	console.log("getPageInfo response = ", response);
	    pageInfo.yPosition = response.pageYOffset;
	    pageInfo.url = response.url;

	    savedPosition = getSavedPosition();
	  });
	});
}

function sendPagePosition(position){
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {type: "setPosition", x: 0, y : position});
	});
}

function getSavedPosition(){
	var pos;
	storage.get(pageInfo.url, function(item){
		console.log("local storage values : ", item);
		pos = item[pageInfo.url];

		//if the saved value is greater than the current
		//position, go to the further position
		if(item[pageInfo.url] > pageInfo.yPosition){
	    	sendPagePosition(item[pageInfo.url]);
	    //if they are equal, reset the value
	    }else if(item[pageInfo.url] === pageInfo.yPosition){
	    	var reset = confirm("Clear the stored position?");
	    	if(reset){
		    	var url = pageInfo.url;
		    	console.log(url);
		    	storage.set({url : 0}, function(item){
		    		console.log("new url value is ", item);
		    	}); //back to the top
		    }
	    //otherwise just save the value in memory
	    }else{
	    	savePageInfo();
	    }
	});
	return pos;
}

function savePageInfo(){
	//save the values stored in pageInfo object
	var json = {};
	json[pageInfo.url] = pageInfo.yPosition;

	storage.set(json, function(){
		storage.get(pageInfo.url, function(item){
			console.log(item);
		})
	});
}

chrome.browserAction.onClicked.addListener(function(tab) { 
	getPageInfo();
});



