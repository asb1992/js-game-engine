// Wrapping browser incompatibilities.
function addEvent(object, event, effect) {
	if (typeof object == "string") {object = $(object);}
	if (object.addEventListener) {
		object.addEventListener(event, effect, false);
	}
	else {
		object.attachEvent("on" + event, effect);
	}
}

// Is IE being used?
ie = (navigator.appName == "Microsoft Internet Explorer" ? true : false);

// Wraps Firefox's insertRule function in Chrome.
if (!(CSSStyleSheet.prototype.addRule)) {
	
	CSSStyleSheet.prototype.addRule = function (tag, rule) {
		
		return document.styleSheets[0].insertRule(tag + "{" + rule + "}", 0);
		
	};
	
}

// Gives Firefox document.head.
if (!(document.head)) {
	
	document.head = document.getElementsByTagName("head")[0];
	
}

// Helper functions.

function $(id) {
	return document.getElementById(id);
}

function stopEvent(event) {
	if (ie) {
		event.returnValue = false;
	}
	else {
		event.preventDefault();
	}
}

function loadScript(name, onload) {
	
	var x = document.createElement('script');
	x.type = "text/javascript";
	x.src = name;
	x.onload = onload;
	document.head.appendChild(x);
	
}

// max is exclusive
function randInt(max) {
	
	return parseInt(Math.random() * max);

}