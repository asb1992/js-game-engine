var charMap = {
	
	"o" : {
		
		"active" : 0,
		"shape": "circle",
		"density": 1,
		"friction": .5,
		"restitution": 0,
		"preventRotation" : true,
		"image": "greenball.png",
		"canBeHurt": 2,
		"movement" : "jump",
		"breaks" : 1,
		"faction" : 0,
		"color" : "green",
		"thrust" : 15,
		
	},
	
	"c" : {
		
		"shape": "square",
		"density": 1,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "cube.png",
		"z-index": 5,
		"breaks" : 1
		
	},
	
	"d" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "dirty.jpg",
		"z-index": 7
		
	},
	
	"w" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image": "wall.png",
		"z-index": 6
		
	},
	
	"g" : {
		
		"image": "grassy.png",
		"z-index": 4
		
	},
	
	"s" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "spikes.png",
		"z-index": 6,
		"pain" : 1
		
	},
	
	"y" : {
		
		"shape": "square",
		"density": 0,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "stone.png",
		"z-index" : 4,
		"fragile": 1,
		"color": "yellow"
		
	},
	
	"m" : {
		
		"shape": "square",
		"density": 10000,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "metal.png",
		"z-index" : 6,
		
	},
	
	"b" : {
		
		"shape": "circle",
		"density": 1,
		"friction": .1,
		"restitution": .7,
		"preventRotation" : false,
		"image": "blueball.png",
		"z-index": 5,
		"breaks" : 1
		
	},
	
	"h" : {
		
		"shape": "square",
		"density": .001,
		"friction": .3,
		"restitution": .3,
		"preventRotation" : false,
		"image" : "heart.png",
		"z-index" : 9,
		"fragile" : 1,
		"heal" : 1,
		"color" : "pink"
		
	}
	
};