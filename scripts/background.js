//this extension just needs to listen to the icon click
//event and store/update the position accordingly
var storage = chrome.storage.local;

chrome.browserAction.setIcon({path: "icon.png"},function(){
});

var pageInfo = {
	yPosition: 0,
	xPosition: 0, //just leave this as 0 for now
	url: ''
}

var SCROLLTHRESHOLD = 5;
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
});

function getPageInfo(){
	chrome.tabs.getSelected(null, function(tab) {
		console.log(tab);
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
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
		pos = item[pageInfo.url];

		//if the saved value is greater than the current
		//position, go to the further position
		if(item[pageInfo.url] - pageInfo.yPosition > SCROLLTHRESHOLD){
	    	sendPagePosition(item[pageInfo.url]);
	    //if they are equal, reset the value
	    }else if(Math.abs(item[pageInfo.url] - pageInfo.yPosition) <= SCROLLTHRESHOLD) {
	    	var reset = confirm("Clear the stored position?");
	    	if(reset){
		    	storage.remove(pageInfo.url); //remove the key
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



