/*  To do:
	relocate to the lib folder
	functions for working with canvas?
*/

// Begin stuff that should be in a wrapper file.

function randInt(max) {
	
	return parseInt(Math.random() * max);
	
}

function deleteNode(node) {
	
	node.parentNode.removeChild(node);
	
}

function asArray(quasiArray, start) {

	var result = [];
	
	for (var i = (start || 0); i < quasiArray.length; i++) {
	
		result.push(quasiArray[i]);
		
	}
	
	return result;
	
}

function partial(func) {

	var fixedArgs = asArray(arguments, 1);
	
	return function() {
	
		return func.apply(null, fixedArgs.concat(asArray(arguments)));
		
	};
	
}

// End stuff that should be in a wrapper file.

var colors = ["red", "blue", "yellow", "green", "black", "white", "silver",
	"violet", "pink", "purple", "brown", "orange", "teal", "aqua", "navy",
	"maroon", "lime"];
	
var colors = ["aqua", "blue", "navy", "white"];
//var colors = ["maroon", "orange", "red", "white"];
//var colors = ["olive", "lime", "green", "white"];

function createParticle(color, x, y, width, height) {
	
	var div = document.createElement('div');
	div.style.width  = width + "px";
	div.style.height = height + "px";
	div.style.backgroundColor = color;
	div.style.position = "absolute";
	div.style.top  = y + "px";
	div.style.left = x + "px";
	div.style.zIndex = 9;
	
	document.body.appendChild(div);
	
	return div;
	
}

/* Really neat background effect.

function randomParticle() {
	
	return createParticle(colors[randInt(colors.length)],
		randInt(document.documentElement.clientWidth - 10),
		randInt(document.documentElement.clientHeight - 10),
		randInt(100),
		randInt(100));
	
}
var paint = setInterval(randomParticle, 10); */

// Turns a CSS 'px' string into a number.
function parseStyle(styleString) {
	
	return parseInt(styleString.slice(0, styleString.length - 2), 10);
	
}

function parseRGBA(rgba) {
	
	return rgba.match(/0*\.*\d+/g);
	
}

function composeRGBA(rgba) {
	
	return "rgba(" + rgba[0] +  ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")";
	
}

function moveParticle(particle, x, y) {
	
	particle.style.top  = parseStyle(particle.style.top)  + y + "px";
	particle.style.left = parseStyle(particle.style.left) + x + "px";
	
}

function createParticleList(color, size, x, y, len) {

	var particles = [];
	
	// Make some particles.
	for (var i = 0; i < len; i++) {
		
		particles.push( createParticle(color, x, y, size, size) );
		
	}
	
	return particles;
	
}

// Broken in IE9, but I should be using canvas anyway.
function explodeParticle(particle) {
	
	var dist = 1;
	var vert = (randInt(5) - 2) * dist;
	var horz = (randInt(5) - 2) * dist;
	
	var moveOneParticle = partial(moveParticle, particle, horz, vert);
	
	// 10 controls speed of particle
	var clearOneInterval = partial(clearInterval, setInterval(moveOneParticle, 10));
	var deleteOneNode = partial(deleteNode, particle);
	
	// 300 controls how long exploding particle is visible
	setTimeout(function(){clearOneInterval(); deleteOneNode();}, 300);
	
}

function explodeParticleList(particles) {
	
	// Move the particles.
	for (var i = 0; i < particles.length; i++) {
		
		explodeParticle(particles[i]);
		
	}
	
}

function createExplosion(color, size, x, y, numParticles) {
	
	if (numParticles === undefined) numParticles = 20;
	
	explodeParticleList( createParticleList(color, size, x, y, numParticles) );
	
}