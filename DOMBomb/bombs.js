var currentHue = 0;
var hueSpeed = 1/6;
setInterval(colorize, 250);

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){	//Listen for button presses from popupMenu html/js
	if(response === "bobomb"){
		var omb = document.createElement("img");
		var url = chrome.runtime.getURL("images/bobomb.gif");
		console.log(url);
		omb.setAttribute("src", url);
//		console.log(omb.attributes.getNamedItem("src"));
		omb.classList.add("bobomb");
		
		$("body").append(omb);
		
	} else if(response === "disco"){
		console.log("Disco mode");
		makeDisco($("body"));
	} else{
		console.log("bad message");
	}
});

////////

function makeDisco(elem){
//	console.log("Parsing: " + elem);
	$(elem).addClass("DOMBombDiscoText");

	$(elem).children().each(function(index, data){
//			console.log("...starting from: " + data);
		makeDisco(data);
	});
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function colorize(){
	var rgb = HSVtoRGB(currentHue, 1, 1);
	
//	$(".DOMBombDiscoBorder").each(function(index, data){
//		$(data).css("border", "1px solid rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
//	});
	
	$(".DOMBombDiscoText").each(function(index, data){
		$(data).css("color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
	});
	
	$(".DOMBombDiscoBackground").each(function(index, data){
		$(data).css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
	});
	
	currentHue += hueSpeed;
	if(currentHue >= 1) currentHue = 0;
}