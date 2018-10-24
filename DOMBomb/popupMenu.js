document.getElementById("bobomb").addEventListener("click", function(e){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, "bobomb", function(response){});
	});
});

document.getElementById("disco").addEventListener("click", function(e){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, "disco", function(response){});
	});
});