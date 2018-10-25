var currentHue = 0;
var hueSpeed = 1/6;
var discoInterval;
var bombLaunched = false;

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){	//Listen for button presses from popupMenu html/js
	if(response === "bobomb" && !bombLaunched){
		bombLaunched = true;
		var targets = [];
		
		doTree($("body"), function(midpoint){}, function(endpoint){
			if($(endpoint).offset().top > 0 && $(endpoint).offset().left > 0){
				targets.push(endpoint);
			}
		});
		
		var omb = document.createElement("img");
		
		omb.setAttribute("src", chrome.runtime.getURL("images/bobomb.gif"));
		
		omb.classList.add("bobomb");
		
		$("body").prepend(omb);
		
		moveBomb(omb, targets);
	}
	
	if(response === "disco" && discoInterval == null){
		$("body").addClass("DOMBombDiscoBackground");
		doTree($("body"), function(midpoint){
			if($(midpoint).height() > 0 && $(midpoint).width() > 0){	//No useless stuff
				$(midpoint).addClass("DOMBombDiscoBackground");
			}
		}, function(endpoint){
			if($(endpoint).height() > 0 && $(endpoint).width() > 0){	//No useless stuff
				$(endpoint).addClass("DOMBombDiscoBackground");
			}
		});
		
		discoInterval = setInterval(colorize, 250);
	} else{
		clearInterval(discoInterval);
		discoInterval = null;
	}
});

////////

function doTree(elem, forAll, forEnd){	//does stuff on the DOM tree
	if($(elem).children().length == 0){	//if this element is an endpoint
		forEnd(elem);
	}
	else {
		forAll(elem);
		$(elem).children().each(function(index, data){	//if this element is not and endpoint, then check all of its children...
			doTree(data, forAll, forEnd);
		});
	}
}

function moveBomb(elem, targets){
	var lastLeft = getCenter(elem).left;
	
	var thisTarget = $(targets.shift());
	var thisPos = getCenter(thisTarget);
	
	if(thisPos.left > lastLeft){
		elem.style.transform = "scaleX(-1)";
	} else{
		elem.style.transform = "scaleX(1)";
	}
	
	var duration = getDist(elem, thisTarget) / .5;	//px / ms bomb speed
	
	
	$(elem).animate({
			top: thisPos.top + "px",
			left: thisPos.left + "px"
	}, duration, "linear", function(){	//on complete
		var boom = document.createElement("img");
		boom.setAttribute("src", chrome.runtime.getURL("images/boom.gif"));
		boom.classList.add("boom");
		$(boom).css("height", 200);
		$(boom).css("width", 200);
		$(boom).css("top", thisPos.top - ($(boom).height()/2));
		$(boom).css("left", thisPos.left - ($(boom).width()/2));
		
		$("body").prepend(boom);
		
		setTimeout(function(){
			$(boom).remove();
		}, 800);
		
		thisTarget.remove();
		if(targets.length >= 1){
			moveBomb(elem, targets);
		}
		else{
			console.log("No more elements to nuke.");
			setTimeout(function(){
				$(elem).remove();
			}, 2000);
		}
	});
}

function getDist(elem1, elem2){
	
	var center1 = getCenter(elem1);
	var center2 = getCenter(elem2);
	
	var y = center1.top - center2.top;
	var x = center1.left - center2.left;
	return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
}

function getCenter(elem){
	return {
		top: $(elem).offset().top + ($(elem).height()/2),
		left: $(elem).offset().left + ($(elem).width()/2)
	};
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
//	
//	$(".DOMBombDiscoText").each(function(index, data){
//		$(data).css("color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
//	});
	
	$(".DOMBombDiscoBackground").each(function(index, data){
		$(data).css("background-color", "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
	});
	
	currentHue += hueSpeed;
	if(currentHue >= 1) currentHue = 0;
}