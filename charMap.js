var charMap = {
	
	"o" : {
		
		"active" : 0,
		"shape": "circle",
		"density": 1,
		"friction": .5,
		"restitution": 0,
		"preventRotation" : true,
		"image": "greenball.png",
		"health": Infinity,
		"movement" : "jump",
		"faction" : 0,
		"weapon" : "",
		"ammo" : 0,
		"color" : "green",
		"thrust" : 15,
		"speedCap" : 200,
		
	},
	
	"c" : {
		
		"shape": "square",
		"density": 1,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "cube.png",
		"color" : "gray",
		
	},
	
	"tnt" : {
		
		"shape": "square",
		"density": 1,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "tnt.png",
		"color" : "red",
		"fragile" : 1,
		"drop" : {"spark" : (function(){return 15})},
		
	},
	
	"spark" : {
		
		"shape" : "circle",
		"density" : 100,
		"disables" : 500,
		"friction" : .5,
		"restitution" : 0,
		"radius" : 2,
		"preventRotation" : false,
		"gravity" : {"x" : 0, "y" : 0},
		"pain" : 1,
		"breaks" : 1,
		"lifetime" : 500,
		"npc" : "random",
		"color" : "red",
		"image" : "redbullet.png",
		"thrust" : 300,
		"speedCap" : 500,
		
	},
	
	"spawner" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"health" : 5,
		"preventRotation" : false,
		"image": "spawner.png",
		"spawn" : {"type" : "e", "freq" : 5},
		"faction" : 1,
		"color" : "white",
		
	},
	
	"q" : { // crate
		
		"shape": "square",
		"density": 1,
		"friction": .3,
		"fragile" : 3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "crate.png",
		"color" : "yellow",
		"drop" : {"e" : (function(){return randInt(3) == 0}),
				  "h" : (function(){return randInt(10) == 0})},
		
	},
	
	/*"t" : {
		
		"shape": "triangle",
		"density": 100,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "cube.png",
		"breaks" : 1,
		"color" : "silver",
		
	},*/
	
	"d" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "dirty.jpg",
		"color" : "brown",
		
	},
	
	/*"p" : { // not sticky enough
		
		"shape": "square",
		"density": 100000000,
		"friction": 1,
		"restitution": 0,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : true,
		"color" : "purple",
		"image": "cloud.png",
		"movement" : "fly",
		"thrust" : 50,
		"speedCap" : 50,
		"npc" : "patrol",
		
	},*/
	
	"w" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "wall.png",
		"color" : "gray",
		
	},
	
	"x" : {
		
		"shape": "square",
		"density": 0,
		"fragile" : 5,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "crackedwall.png",
		"color" : "gray",
		
	},
	
	"g" : {
		
		"image": "grassy.png",
		"color" : "green",
		"no-physics" : true,
		"shape" : "square",
		
	},
	
	"torch" : {
		
		"image": "torch.png",
		"color" : "yellow",
		"no-physics" : true,
		"shape" : "square",
		
	},
	
	"mushroom" : { // don't like the image
		
		"image": "mushroom.png",
		"color" : "brown",
		"no-physics" : true,
		"shape" : "square",
		
	},
	
	"s" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "spikes.png",
		"pain" : 1,
		"breaks" : 1,
		"color" : "gray",
		
	},
	
	"y" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "stone.png",
		"fragile": 1,
		"color" : "yellow",
		
	},
	
	"door" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"opens" : true,
		"image" : "door.png",
		"color" : "brown",
		
	},
	
	"m" : {
		
		"shape": "square",
		"density": 100,
		"friction": .3,
		"restitution": .1,
		"preventRotation" : false,
		"image" : "metal.png",
		"color" : "silver",
		
	},
	
	"b" : {
		
		"active" : 1,
		"shape": "circle",
		"density": 1,
		"friction": .1,
		"restitution": .7,
		"preventRotation" : false,
		"image": "blueball.png",
		"health" : 1,
		"movement" : "jump",
		"faction" : 0,
		"color" : "blue",
		"thrust" : 15,
		
	},
	
	"k" : {
		
		"shape": "circle",
		"density": 10,
		"friction": .1,
		"restitution": .1,
		"preventRotation" : false,
		"image": "metalball.png",
		"breaks" : 1,
		"color" : "blue",
		
	},
	
	"a" : {
		
		"shape": "circle",
		"density": 1,
		"friction": .1,
		"restitution": .1,
		"preventRotation" : true,
		"image": "circle.png",
		"health" : 3,
		"faction" : 1,
		"npc" : "chase",
		"sight" : 800,
		"pain" : 1,
		"movement" : "jump",
		"color" : "red",
		"thrust" : 10,
		"speedCap" : 50,
		"weapon" : "n",
		"ammo" : Infinity,
		
	},
	
	"v" : {
		
		"shape": "circle",
		"density": 5,
		"friction": .1,
		"restitution": .5,
		"preventRotation" : false,
		"image": "spikeball.png",
		"breaks" : 1,
		"pain" : 1,
		"color" : "blue",
		
	},
	
	"e" : {
		
		"shape": "circle",
		"density": 1,
		"friction": .5,
		"restitution": 0,
		"preventRotation" : true,
		"health" : 3,
		"faction" : 1,
		"npc" : "chase",
		"sight" : 800,
		"pain" : 1,
		"movement" : "jump",
		"color" : "black",
		"image": "blackball.png",
		"thrust" : 10,
		"speedCap" : 50,
		
	},
	
	"z" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"faction" : 1,
		"npc" : "turret",
		"color" : "white",
		"image": "redturret.png",
		"weapon" : "n",
		"ammo" : Infinity,
		
	},
	
	"t" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"faction" : 0,
		"npc" : "turret",
		"color" : "white",
		"image": "greenturret.png",
		"weapon" : "i",
		"ammo" : Infinity,
		
	},
	
	"h" : {
		
		"shape": "square",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "heart.png",
		"heal" : 1,
		"collides" : "health",
		"color" : "violet",
		
	},
	
	"wings" : {
		
		"shape": "square",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "wings.png",
		"fly" : 15 * 1000,
		"collides" : "health",
		"color" : "white",
		
	},
	
	"key" : {
		
		"shape": "square",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"gravity" : {"x" : 0, "y" : 0},
		"key" : true,
		"collides" : "active",
		"preventRotation" : false,
		"image" : "key.png",
		"color" : "gold",
		
	},
	
	"redAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "redammo.png",
		"ammoUp" : ["i", Infinity],
		"color" : "red",
		
	},
	
	"redBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "redbullet.png",
		"ammoUp" : ["i", 1],
		"color" : "red",
		
	},
	
	"blueAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "blueammo.png",
		"ammoUp" : ["u", Infinity],
		"color" : "blue",
		
	},
	
	"blueBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "bluebullet.png",
		"ammoUp" : ["u", 1],
		"color" : "blue",
		
	},
	
	"greenAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "greenammo.png",
		"ammoUp" : ["j", Infinity],
		"color" : "green",
		
	},
	
	"greenBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "greenbullet.png",
		"ammoUp" : ["j", 1],
		"color" : "green",
		
	},
	
	"orangeAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "orangeammo.png",
		"ammoUp" : ["n", Infinity],
		"color" : "orange",
		
	},
	
	"orangeBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "orangebullet.png",
		"ammoUp" : ["n", 1],
		"color" : "orange",
		
	},
	
	"yellowAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "yellowammo.png",
		"ammoUp" : ["f", Infinity],
		"color" : "orange",
		
	},
	
	"yellowBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "yellowbullet.png",
		"ammoUp" : ["f", 1],
		"color" : "yellow",
		
	},
	
	"purpleAmmo" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"gravity" : {"x" : 0, "y" : 0},
		"preventRotation" : false,
		"image" : "purpleammo.png",
		"ammoUp" : ["firework", Infinity],
		"color" : "purple",
		
	},
	
	"purpleBullet" : {
		
		"shape": "circle",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"radius" : 10,
		"preventRotation" : false,
		"image" : "purplebullet.png",
		"ammoUp" : ["firework", 1],
		"color" : "purple",
		
	},
	
	"u" : { // knockback and breaking only
		
		"shape": "circle",
		"density": 100,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"gravity" : {"x" : 0, "y" : 0},
		"lifetime" : 500,
		"thrust" : 500,
		"speedCap" : 500,
		"frequency" : 5,
		"disables" : 500,
		"breaks" : 1,
		"image" : "bluebullet.png",
		"color" : "blue",
		
	},
	
	"j" : { // disable only
		
		"shape": "circle",
		"density": .00001,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"gravity" : {"x" : 0, "y" : 0},
		"lifetime" : 1500,
		"thrust" : 200,
		"speedCap" : 200,
		"frequency" : 20,
		"disables" : 1500,
		"image" : "biggreenbullet.png",
		"color" : "green",
		
	},
	
	"firework" : {
		
		"shape": "circle",
		"density": .00001,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"lifetime" : 3000,
		"thrust" : 500,
		"speedCap" : 500,
		"frequency" : 20,
		"drop" : {"spark" : (function(){return 10})},
		"image" : "bigpurplebullet.png",
		"color" : "purple",
		
	},
	
	"i" : { // damage only, machine gun
		
		"shape": "circle",
		"density": .00001,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"pain" : 3,
		"gravity" : {"x" : 0, "y" : 0},
		"lifetime" : 500,
		"thrust" : 500,
		"speedCap" : 500,
		"frequency" : 1,
		"image" : "redbullet.png",
		"color" : "red",
		
	},
	
	"f" : { // damage bullet, medium
		
		"shape": "circle",
		"density": .00001,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"pain" : 1,
		"gravity" : {"x" : 0, "y" : 0},
		"lifetime" : 500,
		"thrust" : 500,
		"speedCap" : 500,
		"frequency" : 3,
		"image" : "yellowbullet.png",
		"color" : "yellow",
		
	},
	
	"n" : { // damage bullet, slow
		
		"shape": "circle",
		"density": .00001,
		"friction": .1,
		"restitution": .2,
		"radius" : 2,
		"preventRotation" : false,
		"npc" : "bullet",
		"pain" : 1,
		"gravity" : {"x" : 0, "y" : 0},
		"lifetime" : 1500,
		"thrust" : 200,
		"speedCap" : 200,
		"frequency" : 20,
		"image" : "orangebullet.png",
		"color" : "orange",
		
	},
	
};