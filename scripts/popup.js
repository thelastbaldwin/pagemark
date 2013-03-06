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
});

function getPageInfo(){
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
	    pageInfo.yPosition = response.pageYOffset;
	    pageInfo.url = response.url;
	    savePageInfo(); //test

	    //if the page's scroll position is longer than the one stored, store it
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

var goto = document.getElementById("goto");
goto.onclick = function(){
	//send a message to contentscript.js to get some 
	//page info. chrome.tabs.getSelected puts us in the current tab
	
	getPageInfo();
	sendPagePosition();
	//Go to last page mark
	//If there is a mark saved, go to it
	//Otherwise, store the mark. This method should be 
	//replaced with the button click and the popup removed.

}