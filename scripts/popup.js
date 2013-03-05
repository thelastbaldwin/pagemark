// sanity check
// alert("here");

var currentPosition,
	url;

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	console.log(sender.tab ?
	        "from a content script:" + sender.tab.url :
	        "from the extension");
	//handle different types of messagess
	if(request.type="pagePosition"){
		console.log(request.pageYOffset,request.url);
		currentPositon = request.pageYOffset;
		url = request.url;
	}
});

function getPageInfo(){
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
	    currentPosition = response.pageYOffset;
	    url = response.url;
	    console.log("response received in popup.js", url, currentPosition);
	  });
	});
}

function sendPagePosition(){
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {type: "getInfo"}, function(response) {
	    currentPosition = response.pageYOffset;
	    url = response.url;
	    console.log("response received in popup.js", url, currentPosition);
	  });
	});
}

function getSavedData(){

}

var goto = document.getElementById("goto");
goto.onclick = function(){
	//send a message to contentscript.js to get some 
	//page info. chrome.tabs.getSelected puts us in the current tab
	
	getPageInfo();
	//Go to last page mark
	//If there is a mark saved, go to it
	//Otherwise, store the mark. This method should be 
	//replaced with the button click and the popup removed.

	
	//window.location returns chrome-extension://bicgdlgipmmdbngejbjockomeeaonolc/popup.html
	//get this communicated from the real page?
	// alert(chrome.extension.getBackgroundPage());
	// alert(chrome.tabs.getCurrent(function(){}));
	console.log(chrome.tabs.getSelected(null,function(tab){
		console.log(tab);
		//alert("here");
	}));
}





