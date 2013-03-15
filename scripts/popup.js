//store the page info like this for lookup and 
//saving reasons
var pageInfo = {
	yPosition: 0,
	xPosition: 0, //just leave this as 0 for now
	url: ''
}

var storage = chrome.storage.local;

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
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
	    pageInfo.yPosition = response.pageYOffset;
	    pageInfo.url = response.url;
	  });
	});
}

function sendPagePosition(){
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {type: "setPosition", x: 0, y : pageInfo.yPosition});
	});
}

function getSavedPosition(){
	var pos;
	storage.get(pageInfo.url, function(item){
		console.log("local storage values : ", item);
		pos = item[url];
		console.log("pos = ", pos);
	});
	return pos;
}

function savePageInfo(){
	var json = {};
	json[pageInfo.url] = pageInfo.yPosition;

	storage.set(json, function(){
		storage.get(pageInfo.url, function(item){
			console.log(item);
		})
	});
}

$("#goto").on('click', function(){
	sendPagePosition();
	console.log("goto");
});
$("#store").on('click', function(){
	savePageInfo();
	console.log("store");
});
$("#store").on('clear', function(){
	console.log("clear");
});