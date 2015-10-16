/*  To do:
	
	checkpoints,
	one-way platforms,
	doorways,
	ammo collision, (improve collision filter system in general)
	indicate somehow that flight is wearing off, (more effects in general)
	modify collision size of some powerups, door,
	line of sight for enemies,
	investigate spawner physics properties,
	direct hit from fireworks gun to tnt crashes game,
	redrawing optimizations,
	spritesheet,
	improve levelbuilder to combine stretches of identical terrain blocks,
	rotation for decorative tiles?,
	make bullet death based on distance, not time,
	change charMap checks to m_userData checks.
	floor labels to prevent walljumps, (no longer sure)
	draw ammo count and current weapon somewhere, (maybe not)
	make explosions not follow the player (absolute, not fixed),
	make enemies only jump if what they're running into is in their path (dungeon fix),
	investigate speed inheritance for bullets,
	make lastShot track different weapons,
	'important' tag to cause loss on death,
	victory tag for killing enemies/colliding with goals?,
	separate visual size from simulation size,
	make moving platforms sticky,
	offscreen detection for rendering fails a little with rotated objects,
	triangles (unfinished),
	split screen?,
	better magnet physics,
	rework movement to use applyforce, etc.,
	restructure elements[], bodies[],
	custom keybindings,
	
*/

var elements = [];
var bodies = [];
var nonphysical = [];

function createRect(chr, offset_left, offset_top, shape) {
	
	var rect = {};
	
	rect.shape  = shape;
	rect.top    = offset_top;
	rect.left   = offset_left;
	rect.width  = tileSideLength / 2;
	rect.height = tileSideLength / 2;
	rect.chr    = chr;
	rect.draw   = true;
	rect.birth = new Date().getTime();
	
	return rect;
	
}

function new_body(size_x, size_y, density, friction, restitution, offsetTop, offsetLeft, preventRotation, shape, rect) {
	
	if (shape == "square") {
		
		return square_body(size_x, size_y, density, friction, restitution, offsetTop, offsetLeft, preventRotation, rect)
	
	}
	
	else if (shape == "circle") {
		
		return circle_body(size_y, density, friction, restitution, offsetTop, offsetLeft, preventRotation, rect)
		
	}
	
	else if (shape == "triangle") {
		
		return triangle_body(size_y, density, friction, restitution, offsetTop, offsetLeft, preventRotation, rect)
		
	}
	
}

function square_body(extents_x, extents_y, density, friction, restitution, offset_top, offset_left, preventRotation, rect) {

	var b2body = new b2BodyDef();
	var box = new b2BoxDef();
	box.extents.Set( extents_x, extents_y );
	box.density = density;
	box.friction = friction;
	box.restitution = restitution;
	b2body.AddShape(box);
	b2body.userData = rect;
	b2body.position.Set(offset_left, offset_top);
	b2body.preventRotation = preventRotation;
	rect.shape = "square";
	elements.push(rect);
	var body = world.CreateBody(b2body)
	bodies.push(body);
	return body;
	
}

function circle_body(radius, density, friction, restitution, offset_top, offset_left, preventRotation, rect) {

	var b2body = new b2BodyDef();
	var circle = new b2CircleDef();
	circle.radius = charMap[rect.chr].radius || radius;
	circle.density = density;
	circle.friction = friction;
	circle.restitution = restitution;
	if (charMap[rect.chr].npc == "bullet") {b2body.bullet = true;}
	b2body.AddShape(circle);
	b2body.userData = rect;
	b2body.position.Set(offset_left, offset_top);
	b2body.preventRotation = preventRotation;
	rect.shape = "circle";
	elements.push(rect);
	var body = world.CreateBody(b2body)
	bodies.push(body);
	return body;
	
}

function triangle_body(thing, density, friction, restitution, offset_top, offset_left, preventRotation, rect) {

	var b2body = new b2BodyDef();
	var triangle = new b2PolyDef();
	triangle.vertexCount = 3;
	var points = [[0, 0], [0, 40], [-40, 40]];
	for (var i = 0; i < points.length; i++) {
		triangle.vertices[i].Set(points[i][0], points[i][1]);
	}
	triangle.density = density;
	triangle.friction = friction;
	triangle.restitution = restitution;
	b2body.AddShape(triangle);
	b2body.userData = rect;
	b2body.position.Set(offset_left, offset_top);
	b2body.preventRotation = preventRotation;
	rect.shape = "triangle";
	elements.push(rect);
	var body = world.CreateBody(b2body)
	bodies.push(body);
	return body;
	
}

function createFromChr(chr, offsetLeft, offsetTop) {
	
	var rect = createRect(chr, offsetLeft - tileSideLength / 4, offsetTop - tileSideLength / 4, charMap[chr].shape);
	if (charMap[chr]["no-physics"]) {nonphysical.push(rect);}
	else {var body = new_body(tileSideLength / 2, tileSideLength / 2, charMap[chr].density, charMap[chr].friction, charMap[chr].restitution, offsetTop, offsetLeft, charMap[chr].preventRotation, charMap[chr].shape, rect);}
	// code breaks on line above
	
	if (body) {
		
		initBodyProperties(body);
		
		bodiesByClass[getClassName(body)].push(body);
		
		return body;
		
	}
	
}

function createFromData(data) {
	
	for (var i = 0; i < data.length; i++) {
		
		createFromChr(data[i].chr, data[i].x, data[i].y);
		
	}
	
}

function createPhysicsWorld() {
	
	worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-200000, -200000);
	worldAABB.maxVertex.Set(200000, 200000);
	world = new b2World(worldAABB, new b2Vec2(0, 0), true);
	
}

function createPropertyArrays() {
	
	// Determine which classes have which properties,
	// and create arrays containing this information.
	var properties = [
					  "health",
					  "pain",
					  "fragile",
					  "breaks",
					  "movement",
					  "heal",
					  "fly",
					  "active",
					  "magnet",
					  "metal",
					  "thrust",
					  "npc",
					  "spawn",
					  "weapon",
					  "ammoUp",
					  "disables",
					  "faction",
					  "key",
					  "opens",
					  "collides",
					  ];
	
	for (var i = 0; i < properties.length; i++) {window[properties[i]] = [];}
	
	for (tile in charMap) {
		
		for (var i = 0; i < properties.length; i++) {
			
			if (properties[i] in charMap[tile]) {window[properties[i]].push(tile);}
			
		}
		
	}
	
}

function initBodiesByClass() {
	
	var bodiesByClass = {};
	
	for (var chr in charMap) bodiesByClass[chr] = [];
	
	return bodiesByClass;
	
}

function initBodyProperties(body) {
	
	var staticProps = ["density", "shape", "restitution", "friction", "preventRotation"];
	
	for (var prop in getBodyProperties(body)) {
		
		if (prop == "density" &&
			getBodyProperties(body).density > 0 &&
			!body.m_userData.gravity) {
			
			body.m_userData.gravity = {"x" : 0, "y" : 8};
			
		}
		
		if (staticProps.indexOf(prop) !== -1) {continue;}
		
		if (prop == "health") {body.m_userData.lastHurt = 0;}
		
		// because m_userData doesn't show up soon enough for collisions
		if (prop == "collides") {
			
			body.collides = getBodyProperties(body).collides;
			
		}
		
		body.m_userData[prop] = getBodyProperties(body)[prop];
		
	  
	
	}
	
}

function getBodiesByProperty(property) {
	
	var acc = [];
	for (var i = 0; i < bodies.length; i++) {
		
		if (property in bodies[i].m_userData) {acc.push(bodies[i]);}
		
	}
	
	return acc;
	
}

function getActiveObjects() {
	
	var players = [];
	var actives = getBodiesByProperty("active");
	
	for (var i = 0; i < actives.length; i++) {
			
		players[getBodyProperties(actives[i]).active] = actives[i];
		
	}
	
	return players;
	
}

function init_world() {
	
	tileSideLength = 40; // global
	simpleDrawing = false;
	
	set_default_options();
	
	bodiesByClass = initBodiesByClass();
	
	createPropertyArrays();
	
	createPhysicsWorld();
	
	//contactFilter();
	
	createFromData(worldData);
	
	players = getActiveObjects();
	
	// Flag to prevent loss message from appearing twice.
	alerted = false;
	
	for (var i = 0; i < players.length; i++) {
		
		players[i].left = false;
		players[i].up = false;
		players[i].right = false;
		players[i].down = false;
		
	}
	
	document.onkeydown = keydownInput;
	document.onkeyup = keyupInput;
	document.onmousedown = mousedownInput;
	document.onmouseup = mouseupInput;
	document.onmousemove = mousemove;
	mX = 0; mY = 0;
	
	ignoredContacts = [];
	
	contactFilter();
	
	newton = setInterval(loop, 1000 / 40);
	
}

function loop() {
	
	world.Step(1 / 40, 1);
	
	applyGravity();
	
	applyMagnetism();
	
	visuals();
	
	cleanIgnoredContacts(ignoredContacts);
	
	checkLoss(players[0]);
	
	updateHUD();
	
	activateSpawners();
	
	shoot();
	
	var npcs = getBodiesByProperty("npc");
	for (var i = 0; i < npcs.length; i++) updateAI(npcs[i]);
	
	var movers = getBodiesByProperty("thrust");
	for (var i = 0; i < movers.length; i++) move(movers[i]);
	
	collisions(world);
	
	cleanDeadBodies(bodies);
	
	clear();
	
	drawWorld();
	
}

function drawWorld() {
	
	var ctx = $("canvas").getContext("2d");
	
	var toBeDrawn = nonphysical.concat(elements);
	
	var width  = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	var active = players[0].m_userData;
	
	var leftToCenter = width/2;
	var topToCenter = height/2;
	
	// coordinates of left and top of screen, provided active is centered.
	var left = active.left - leftToCenter + (tileSideLength / 2);
	var top  = active.top  - topToCenter  + (tileSideLength / 2);
	
	
	
	for (var i = 0; i < toBeDrawn.length; i++) {
		
		var rect = toBeDrawn[i];
		
		// coordinates relative to the screen's position.
		rect.screenLeft = rect.left - left;
		rect.screenTop  = rect.top - top;
		
		// what area of the world to render
		if (((rect.left > active.left - leftToCenter - tileSideLength/2 &&
			rect.left < active.left + leftToCenter + tileSideLength/2) &&
			(rect.top > active.top - topToCenter - tileSideLength/2 &&
			rect.top < active.top + topToCenter + tileSideLength/2)) &&
			rect.draw) {
			
			ctx.save();
			ctx.translate(rect.screenLeft, rect.screenTop);
			if (rect.rotation) {
				
				ctx.translate(tileSideLength/2, tileSideLength/2);
				ctx.rotate(rect.rotation);
				ctx.translate(-tileSideLength/2, -tileSideLength/2);
				
			}
			
			if (simpleDrawing) {
				
				ctx.fillStyle = charMap[rect.chr].color;
				
				if (rect.shape == "square") ctx.fillRect(0, 0, tileSideLength, tileSideLength);
				
				else { // circle
					
					ctx.beginPath();
					ctx.arc(0, 0, (charMap[rect.chr].radius || tileSideLength / 2), 0, Math.PI * 2, true);
					ctx.fill();
					ctx.closePath();
					
				}
				
			}
			
			else {
				
				var img = new Image();
				img.src = "images/" + charMap[rect.chr].image;
				ctx.drawImage(img, 0, 0);
				
			}
			
			ctx.restore();
			
		}
		
	}
	
	// draw health
	var hurtables = getBodiesByProperty("health");
	
	for (var i = 0; i < hurtables.length; i++) {
		
		var rect = hurtables[i].m_userData;
		ctx.textBaseline = "bottom";
		var hp = (rect.health == Infinity ? "\u221e" : rect.health)
		
		ctx.fillStyle = (hurtables[i].m_userData.faction == 
			players[0].m_userData.faction ? "lime" : "#ff1111");
		ctx.font = "30px sans-serif"
		var textWidth = ctx.measureText(hp).width;
		ctx.fillText(hp,
			rect.screenLeft + tileSideLength/2 - textWidth/2, rect.screenTop);
				
		ctx.strokeStyle = "black";
		ctx.font = "30px sans-serif"
		textWidth = ctx.measureText(hp).width;
		ctx.strokeText(hp,
			rect.screenLeft + tileSideLength/2 - textWidth/2, rect.screenTop);
		
	}
		
}

function clear() {
	
	var ctx = $("canvas").getContext("2d");
	var color = options.background;
	
	var grad = ctx.createLinearGradient(0, 0, 0, document.documentElement.clientHeight);
	grad.addColorStop(0, color[0]);
	grad.addColorStop(1, color[1]);
	
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
}

function applyGravity() {
	
	for (var i = 0; i < bodies.length; i++) {
		
		if (getBodyProperties(bodies[i]).density > 0) {
			
			var gravity = bodies[i].m_userData.gravity;
			
			bodies[i].WakeUp(true);
			bodies[i].m_linearVelocity.x += gravity.x;
			bodies[i].m_linearVelocity.y += gravity.y;
			
		}
		
	}
	
}

function applyMagnetism() {
	
	var magnets = getBodiesByProperty("magnet");
	var metals  = getBodiesByProperty("metal");
	var force = 5;
	
	for (var i = 0; i < magnets.length; i++) {
		
		for (var j = 0; j < metals.length; j++) {
			
			var magnetPos = magnets[i].GetCenterPosition();
			var metalPos  = metals[j].GetCenterPosition();
			
			metals[j].WakeUp(true);
			
			if (metalPos.x < magnetPos.x) {
				
				metals[j].m_linearVelocity.x += force;
				
			}
			
			else {metals[j].m_linearVelocity.x -= force;}
			
			if (metalPos.y < magnetPos.y) {
				
				metals[j].m_linearVelocity.y += force;
				
			}
			
			else{metals[j].m_linearVelocity.y -= force;}
			
		}
		
	}
	
}

function visuals() {
	
	for (i = 0; i < bodies.length; i++) {
		
		var body = bodies[i];
		var element = elements[i];
		
		// Binds bodies in the physics simulation to visuals.
		element.left = (body.m_position.x - (tileSideLength / 2 >> 1));
		element.top  = (body.m_position.y - (tileSideLength / 2 >> 1));
		
		// Only rotate things which can rotate.
		if (!(getBodyProperties(bodies[i]).preventRotation)) {element.rotation = body.m_rotation0;}
		
	}
	
}

function updateHUD() {
	
	if (players[0].m_userData.weapon) {
		
		// dependent on image names
		$("ammopic").style.background =
			"url(images/big" + charMap[players[0].m_userData.weapon].image + ")";
		
		if (players[0].m_userData.ammo == Infinity) {
			
			$("ammocount").innerHTML = "&infin;";
			
		}
		
		else {
			
			$("ammocount").innerHTML = players[0].m_userData.ammo;
			
		}
		
	}
	
	if (players[0].m_userData.keys !== undefined) {
	
		$("keypic").style.background =
			"url(images/" + charMap[key].image + ")"; // hard-coded
		
		if (players[0].m_userData.keys == Infinity) {
			
			$("keycount").innerHTML = "&infin;";
			
		}
		
		else {
			
			$("keycount").innerHTML = players[0].m_userData.keys;
			
		}
		
	}
	
}

function checkLoss(active) {
	
	if (active.isDead) {
		
		if (!alerted) {
		
			alerted = true;
			setTimeout('alert("You died.");' +
			'location.reload();', 750);
		
		}
		
	}
	
}

function cleanIgnoredContacts(list) {
	
	var now = new Date().getTime();
	
	for (var i = 0; i < list.length; i++) {
		
		// the i-- is necessary to prevent skipping over elements.
		if (now - list[i][1] > 1000) {list.splice(i, 1); i--;}
		
	}
	
}

function cleanDeadBodies() {
	
	for (var i = 0; i < bodies.length; i++) {
		
		if (bodies[i].isDead) {
			
			bodiesByClass[getClassName(bodies[i])].splice(bodiesByClass[getClassName(bodies[i])].indexOf(bodies[i]), 1)
			bodies.splice(i, 1);
			elements.splice(i, 1);
			i--;
			
		}
		
	}
	
}

function contactFilter() {
	
	var collisionFilter = new b2CollisionFilter();
	
	collisionFilter.ShouldCollide = function(shape1, shape2) {
		
		var body1 = shape1.m_body;
		var body2 = shape2.m_body;
		
		if (!body1.collides && !body2.collides) {return true;} 
		
		//console.log(body2);
		
		// do this in a cleaner way
		// ideally with findNodeProperty from collisions
		if (hasProperty(body1, collides)) {
			
			if (hasProperty(body2, window[body1.collides])) {
				
				return true;
				
			}
			
			return false;
			
		}
		
		if (hasProperty(body2, collides)) {
			
			if (hasProperty(body1, window[body2.collides])) {
				
				return true;
				
			}
			
			return false;
			
		}
				
	};
	
	world.SetFilter(collisionFilter);
	for (var i = 0; i < bodies.length; i++) bodies[i].WakeUp();
	
}

// Used to tell if the same objects have collided recently.
function contactEquals(contact1, contact2) {
	
	if (contact1.m_node1.other == contact2.m_node1.other &&
		contact1.m_node2.other == contact2.m_node2.other) {
		
		return true;
		
	}
	
}

// The node with the first property is returned at [0],
// and the node with the second is returned at [1].
function findNodeProperties(prop1, prop2, contact) {
	
	if (prop1.indexOf(getClassName(contact.m_node1.other)) != -1 &&
		prop2.indexOf(getClassName(contact.m_node2.other)) != -1) {
			
			return [contact.m_node1.other, contact.m_node2.other];
			
		}
		
	else if (prop2.indexOf(getClassName(contact.m_node1.other)) != -1 &&
		prop1.indexOf(getClassName(contact.m_node2.other)) != -1) {
			
			return [contact.m_node2.other, contact.m_node1.other];
			
		}
	
	else return false;
	
}

// Similar to findNodeProperties, but seeking only one property.
// Returns the node which has it.
function findNodeProperty(prop, contact) {
	
	if (prop.indexOf(getClassName(contact.m_node1.other)) != -1) {
		
		return [contact.m_node1.other, contact.m_node2.other]
		
	}
	
	else if (prop.indexOf(getClassName(contact.m_node2.other)) != -1) {
		
		return [contact.m_node2.other, contact.m_node1.other]
		
	}
	
	else return false;
	
}

function collisions(world) {
	
	for (var contact = world.GetContactList(); contact; contact = contact.GetNext()) {
		
		//needed to prevent action when these are null
		if (contact.m_node1.other && contact.m_node2.other) {
			
			var skip = false; // for skipping over contacts happening too close together.
			
			for (var i = 0; i < ignoredContacts.length; i++) {
				
				// if this contact is in ignoredContacts, skip this contact
				if (contactEquals(contact, ignoredContacts[i][0])) {skip = true; break;}
				
			}
			
			if (skip) continue;
			
			// What happens when certain things collide.
			
			// Determine what kind of collision happened and get the bodies involved.
			var fragileCollision       = findNodeProperties(fragile,   breaks,    contact);
			var painfulCollision       = findNodeProperties(health,    pain,      contact);
			var doubleJumpCollision    = findNodeProperties(movement,  movement,  contact);
			var doubleDisableCollision = findNodeProperties(disables,  disables,  contact);
			var disableCollision       = findNodeProperty  (disables,             contact);
			var jumpCollision          = findNodeProperty  (movement,             contact);
			var ammoCollision          = findNodeProperties(faction,   ammoUp,    contact);
			var healCollision          = findNodeProperties(health,    heal,      contact);
			var flyCollision           = findNodeProperties(movement,  fly,       contact);
			var keyCollision           = findNodeProperties(active,    key,       contact);
			var openCollision          = findNodeProperties(active,    opens,     contact);
			var doubleVictimCollision  = findNodeProperties(health,    health,    contact);
			var doublePainCollision    = findNodeProperties(pain,      pain,      contact);
			
			// Logic for different types of collisions.
			
			// Two pain-causing hurtable objects collide.
			if (doubleVictimCollision && doublePainCollision) {
				
				// members of the same faction won't hurt eachother.
				if (doubleVictimCollision[0].m_userData.faction !==
					doubleVictimCollision[1].m_userData.faction) {
					
					for (var i = 0; i < doubleVictimCollision.length; i++) {
						
						var victim = doubleVictimCollision[i].m_userData;
						var attacker = doubleVictimCollision[doubleVictimCollision.length - 1 - i].m_userData;
						
						if ((new Date().getTime() - victim.lastHurt) > 1000) {
							
							victim.lastHurt = new Date().getTime();
							
							flicker(doubleVictimCollision[i], 8);
							
							victim.health -= charMap[attacker.chr]["pain"];
							
							if (victim.health <= 0) {destroyTile(doubleVictimCollision[i]);}
							
						}
					
					}
					
				}
				
			}
			
			else if (painfulCollision) {
				
				// !== means no faction listed and faction 0 are different.
				if (painfulCollision[0].m_userData.faction !==
					painfulCollision[1].m_userData.faction) {
					
					var victim = painfulCollision[0].m_userData;
					var attacker = painfulCollision[1].m_userData;
					
					// This makes you temporarily invulnerable after you get hurt
					// if the last time you got hurt was more than a second ago.
					if ((new Date().getTime() - victim.lastHurt) > 1000) {
						
						victim.lastHurt = new Date().getTime();
						
						flicker(painfulCollision[0], 8);
						
						// Reduce the hurt object's health by the attacker's strength.
						victim.health -= charMap[attacker.chr]["pain"];
						
						// Kill objects with no health.
						if (victim.health <= 0) {destroyTile(painfulCollision[0]);}
						
					}
					
				}
				
			}
			
			if (fragileCollision) {
				
				var durability = getBodyProperties(fragileCollision[0])["fragile"];
				var strength = getBodyProperties(fragileCollision[1])["breaks"];
				
				(fragileCollision[0].durability ? fragileCollision[0].durability -= strength :
				 fragileCollision[0].durability = durability - strength);
				
				if (fragileCollision[0].durability < 1) {
					
					destroyTile(fragileCollision[0],
						(getClassName(fragileCollision[0]) == "tnt" ? 0 : undefined));
					
				}
				else {createExplosion(getBodyProperties(fragileCollision[0]).color, 4,
					fragileCollision[0].m_userData.screenLeft,
					fragileCollision[0].m_userData.screenTop, 5);}
				
			}
			
			function checkJump(b1, b2) {
				
					// Need better wallclimbing fix.
				
					// b1 above b2 and...
				return b1.GetCenterPosition().y < b2.GetCenterPosition().y &&
					// b1 within 39px of b2 horizontally.
					Math.abs(b1.GetCenterPosition().x - b2.GetCenterPosition().x) <= 39;
				
			}
			
			// jump off of things which can jump.
			if (doubleJumpCollision && 
				getBodyProperties(doubleJumpCollision[0]).movement == "jump" &&
				getBodyProperties(doubleJumpCollision[1]).movement == "jump") {
				
				// prevents death by falling
				doubleJumpCollision[0].fallTimer = undefined;
				doubleJumpCollision[1].fallTimer = undefined;
				
				if (checkJump(jumpCollision[0], jumpCollision[1])) {
					
					doubleJumpCollision[0].canJump = true;
					
				}
				
				if (checkJump(jumpCollision[1], jumpCollision[0])) {
					
					doubleJumpCollision[1].canJump = true;
					
				}
				
			}
			
			else if (jumpCollision && getBodyProperties(jumpCollision[0]).movement == "jump") {
				
				// prevents death by falling
				jumpCollision[0].fallTimer = undefined;
				
				// if the jumper is above the other body
				if (checkJump(jumpCollision[0], jumpCollision[1]) &&
					jumpCollision[1].m_userData.npc !== "bullet" &&
					jumpCollision[1].m_userData.npc !== "random") {
					
					jumpCollision[0].canJump = true;
					
				}
				
			}
			
			if (healCollision) {
				
				var healing = getBodyProperties(healCollision[1])["heal"];
				
				healCollision[0].m_userData.health += healing;
				destroyTile(healCollision[1]);
				
			}
			
			if (flyCollision) {
				
				var duration = flyCollision[1].m_userData.fly;
				flyCollision[0].m_userData.movement = "fly";
				
				// closure
				function resetMovement(body) {
					
					return function() {
						body.m_userData.movement =
							getBodyProperties(body).movement;
					}
					
				}
				
				setTimeout(resetMovement(flyCollision[0]), duration);
				
				destroyTile(flyCollision[1]);
				
			}
			
			if (keyCollision) {
				
				if (!keyCollision[0].m_userData.keys) {
					
					keyCollision[0].m_userData.keys = 1;
					
				}
				
				else {keyCollision[0].m_userData.keys += 1;}
				
					destroyTile(keyCollision[1]);
				
			}
			
			if (openCollision) {
				
				if (openCollision[0].m_userData.keys > 0) {
					
					openCollision[0].m_userData.keys -= 1;				
					destroyTile(openCollision[1]);
					
				}
				
			}
			
			if (ammoCollision) {
				
				var amm = getBodyProperties(ammoCollision[1]).ammoUp.slice();
				
				ammoCollision[0].m_userData.weapon = amm[0];
				if (ammoCollision[0].m_userData.ammo == Infinity ||
					!ammoCollision[0].m_userData.ammo) {
					ammoCollision[0].m_userData.ammo = amm[1];}
				else {ammoCollision[0].m_userData.ammo += amm[1];}
				destroyTile(ammoCollision[1]);
				
			}
			
			if (doubleDisableCollision &&
				doubleDisableCollision[0].m_userData.faction !== doubleDisableCollision[1].faction) {
				
				var disable0 = doubleDisableCollision[0];
				var disable1 = doubleDisableCollision[1];
				var disableDuration0 = getBodyProperties(disable0).disables;
				var disableDuration1 = getBodyProperties(disable1).disables;
				disable0.disabled = [new Date().getTime(), disableDuration1];
				disable1.disabled = [new Date().getTime(), disableDuration0];
				
			}
			
			else if (disableCollision &&
				disableCollision[0].m_userData.faction !== disableCollision[1].m_userData.faction) {
				
				var disabler = disableCollision[0];
				var disabled = disableCollision[1];
				var disableDuration = getBodyProperties(disabler).disables;
				disabled.disabled = [new Date().getTime(), disableDuration];
				
			}
			
			// bullet destruction on collide
			var bullet1 = getBodyProperties(contact.m_node1.other).npc == "bullet" &&
				contact.m_node2.other != contact.m_node1.other.parent;
			var bullet2 = getBodyProperties(contact.m_node2.other).npc == "bullet" &&
				contact.m_node1.other != contact.m_node2.other.parent;
			
			if (bullet1 || bullet2) {
				
				if (bullet1) destroyTile(contact.m_node1.other, 0);
				if (bullet2) destroyTile(contact.m_node2.other, 0);
				
			}
			
			// current contact added to ignoredContacts so it can't recur for a bit.
			ignoredContacts.push([contact, new Date().getTime()]);
		
		}
	
	}
	
}

function getClassName(body) {
	
	return body.m_userData.chr;
	
}

function getBodyProperties(body) {
	
	return charMap[getClassName(body)]
	
}

function hasProperty(body, property) {
	
	return property.indexOf(getClassName(body)) > -1;
	
}

function destroyTile(body, particleNum) {
	
	if (body.m_userData.drop) {
		
		
		for (var elem in body.m_userData.drop) {
			
			for (var i = 0; i < body.m_userData.drop[elem](); i++) {
				
				createFromChr(elem,
					body.GetCenterPosition().x, body.GetCenterPosition().y);
					
			}
		
		}
		
	}
	
	// This loop stops tiles from flickering when they're to be destroyed.
	// Previously the flickering would cause dead tiles to remain visible.
	if (body.timeout) {
		
		for (var i = 0; i < body.timeout.length; i++) {
			
			clearTimeout(body.timeout[i]);
			
		}
		
	}
	
	body.isDead = true;
	
	world.DestroyBody(body); // world is global
	body.m_userData.draw = false;
	
	// Explosion time.
	if (particleNum === undefined) particleNum = 20;
	createExplosion(getBodyProperties(body).color, 4,
		body.m_userData.screenLeft, body.m_userData.screenTop, particleNum);
	
}

function flicker(body, cycles) {
	
	var sight = true;
	
	for (var i = 0; i < 125 * cycles; i += 125) {
		
		
		function changeVisibility() {
			
			sight = (sight == false ? true : false);
			body.m_userData.draw = sight;
			
		}
		
		// For the purpose of canceling the flickers on the tile's death.
		if (!body.timeout) body.timeout = [setTimeout(changeVisibility, i)];
		else body.timeout.push(setTimeout(changeVisibility, i));
		
	}
	
}

function activateSpawners() {
	
	var spawners = getBodiesByProperty("spawn");
	for (var i = 0; i < spawners.length; i++) {
		
		if (new Date().getSeconds() % getBodyProperties(spawners[i]).spawn.freq == 0 &&
			spawners[i].lastSpawn != new Date().getSeconds() &&
			getDistance(players[0], spawners[i]) < 700) {
				
				createFromChr(getBodyProperties(spawners[i]).spawn.type,
					spawners[i].GetCenterPosition().x,
					spawners[i].GetCenterPosition().y);
				
				spawners[i].lastSpawn = new Date().getSeconds(); // will fail for spawn times which are multiples of a minute.
				
			}
		
	}
	
}

function shoot() {
	
	var shooters = getBodiesByProperty("weapon");
	
	for (var i = 0; i < shooters.length; i++) {
		
		if (shooters[i].isShooting &&
			shooters[i].m_userData.ammo > 0) {
			
			// skip disabled shooters
			if (shooters[i].disabled) {
				
				if (shooters[i].disabled[0] + shooters[i].disabled[1]
					> new Date().getTime()) {continue;}
				
			}
			
			updateMousePos();
			var shooterProperties = getBodyProperties(shooters[i]);
			
			if (!shooters[i].lastShot || // shooter has not yet fired
				Math.round(new Date().getTime() / 100) - // current time
				shooters[i].lastShot > // time of last shot
				// how often bullet may be fired in tenths of a second.
				charMap[shooters[i].m_userData.weapon].frequency) {
				
				function shootBullet(shooter, target) {
					
					// mouse-based firing direction math
					var xDiff = target[0] - (shooter.m_userData.left + tileSideLength/2);
					var yDiff = target[1] - (shooter.m_userData.top + tileSideLength/2);
					var cap   = charMap[shooter.m_userData.weapon].speedCap;
					var normalizationFactor =
						cap / Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
					var xComponent = normalizationFactor * xDiff;
					var yComponent = normalizationFactor * yDiff;
					
					// create bullet, set its position
					var bullet = createFromChr(shooter.m_userData.weapon,
						shooter.GetCenterPosition().x + xComponent/20,
						shooter.GetCenterPosition().y + yComponent/20);
						
					// bullet movement
					bullet.xComponent = normalizationFactor * xDiff// +
						//shooter.m_linearVelocity.x; // speed inheritance
					bullet.yComponent = normalizationFactor * yDiff// +
						//shooter.m_linearVelocity.y;
					
					// details
					bullet.m_userData.faction = shooter.m_userData.faction;
					bullet.parent = shooter;
					
					// in tenths of a second
					shooter.lastShot = Math.round(new Date().getTime() / 100);
					
					// remove one ammo.
					shooter.m_userData.ammo -= 1;
						
				}
				
				shootBullet(shooters[i], shooters[i].target);
				
			}
			
		}
		
	}
	
}

function updateMousePos() {
	
	var width  = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	var active = players[0].m_userData;
	
	var leftToCenter = width/2;
	var topToCenter = height/2;
	
	// coordinates of left and top of screen, provided active is centered.
	var left = active.left - leftToCenter + tileSideLength / 2;
	var top  = active.top  - topToCenter  + tileSideLength / 2;
	
	// globals
	mouseX = mX + left;
	mouseY = mY + top;
	
	players[0].target = [mouseX, mouseY];
	
}

function getDistance(b1, b2) {
	
	var p1 = b1.GetCenterPosition().Copy();
	var p2 = b2.GetCenterPosition().Copy();
	return calcDistance(p1.x, p1.y, p2.x, p2.y);
	
}

function calcDistance(x1, y1, x2, y2) {
	
	return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
	
}

function updateAI(body) {
	
	var properties = body.m_userData;
	var npcType = properties.npc;
	var movementType = properties.movement;
	var shoots = body.m_userData.weapon;
	if (shoots) {var bulletProps = charMap[shoots];}
	var attackRange = (shoots ?
		bulletProps.speedCap * .95 * bulletProps.lifetime / 1000 : 0);
	var sight = properties.sight || attackRange;
	
	// target acquiring logic
	if (npcType != "random" && npcType != "bullet") {
		
		// makes him chase the closest thing of a different faction that can be hurt.
		var targets = filter(function(body2){
				return body.m_userData.faction !==
				body2.m_userData.faction
			},
			getBodiesByProperty("health"));
		
		var target = targets[0];
		
		for (var i = 0; i < targets.length; i++) {
			
			if (getDistance(body, targets[i]) < getDistance(body, target)) target = targets[i];
			
		}
		
		// take no action if target isn't close enough to see.
		if (target && getDistance(body, target) > sight) {
			
			body.up = false;
			body.left = false;
			body.right = false;
			body.down = false;
			body.isShooting = false;
			return; 
			
		}
		
	}
	
	if (target) {
		
		var inAttackRange = getDistance(body, target) - (attackRange +
			tileSideLength) <= 0; // Math.sqrt(2 * Math.pow(tileSideLength, 2))
		
	}
	
	// shooting logic
	if (target && inAttackRange) {
		
		body.isShooting = true;
		body.target = [target.m_userData.left + tileSideLength/2,
			target.m_userData.top + tileSideLength/2]
		
	} else {body.isShooting = false;}
	
	
	// vertical movement logic
	if (movementType == "jump") {
		
		if (body.canJump) {
			
			for (var contact = body.GetContactList(); contact; contact = contact.next) {
				
				// no reason to jump if you're touching the player already.
				if (target &&
					contact.other.m_userData.faction ===
					target.m_userData.faction) {
					
					body.up = false;
					break;
					
				}
				if (getBodyProperties(contact.other).npc == "bullet") {continue;}
				
				body.up = Math.abs(contact.other.GetCenterPosition().y -
					body.GetCenterPosition().y) <= 20 || // jump over obstacles
					getClassName(contact.other) == "s"; // jump out of spike pits
				
				if (body.up) {break;}
				
			}
			
			// jump if target is directly over you.
			if (target) {
				
				body.up = body.up ||
				Math.abs(target.GetCenterPosition().x -
				body.GetCenterPosition().x) <= 20 &&
				target.GetCenterPosition().y <
				body.GetCenterPosition().y;
				
			}
			
		}
		
	}
	
	else if (movementType == "fly") {
		
		if (target) {
			
			// stay half of your attack range above the target.
			if (body.GetCenterPosition().y + attackRange >
				target.GetCenterPosition().y) {body.up = true;}
			
			else {body.up = false;}
			
		}
		
	}
	
	else if (movementType == "swap") {
		
		
		
	}
	
	// horizontal movement logic
	if (npcType == "chase" && target) {
		
		if (!inAttackRange) {
			
			if (target.GetCenterPosition().x < body.GetCenterPosition().x) {
				
				body.left = true;
				body.right = false;
				
			} else {body.left = false; body.right = true;}
			
		} else {body.left = false; body.right = false;}
		
		body.face  = (body.left ? -1 : 1);
		
	}
	
	// platforms
	else if (npcType == "patrol") {
		
		var second = Math.round((new Date().getTime() - body.m_userData.birth) / 1000);
		if (second % 3 == 0 && second != body.second) {
			
			body.left  = !body.left;
			body.right = !body.left;
			body.second = second;
			
		}
		
	}
	
	else if (npcType == "random" && !body.xComponent) {
		
		body.xComponent = properties.speedCap * Math.random() *
			([-1, 1][randInt(2)]);
		body.yComponent = properties.speedCap * Math.random() *
			([-1, 1][randInt(2)]);
		
	}
	
}

function move(body) {
	
	// kill it if it's been alive too long.
	if (body.m_userData.lifetime &&
		new Date().getTime() - body.m_userData.birth >
		body.m_userData.lifetime) {destroyTile(body, 0); return;}
	
	// if you're disabled, don't move.
	if (body.disabled &&
		body.disabled[0] + body.disabled[1] - // time body is disabled until
		new Date().getTime() > 0) {}
	
	// if you're a bullet...
	else if (body.m_userData.npc == "bullet" ||
		body.m_userData.npc == "random") {	
		
		body.WakeUp(true);
		body.m_linearVelocity.x = body.xComponent;
		body.m_linearVelocity.y = body.yComponent;
		body.xComponent += body.m_userData.gravity.x;
		body.yComponent += body.m_userData.gravity.y;
		
	}
	
	else {
		
		var jumpHeight   = -175;
		var maxFallSpeed =  500;
		var thrust   = body.m_userData.thrust;
		var cap      = body.m_userData.speedCap;
		var movement = body.m_userData.movement;
		
		// default
		if (cap === undefined) cap = 500;
		
		body.WakeUp(true);
		
		if (body.left) {
			
			body.m_linearVelocity.x += -thrust;
			
		}
		
		if (body.up) {
		
			if (movement == "fly") body.m_linearVelocity.y += -thrust;
			
			if (movement == "jump" && body.canJump) {
				
				body.m_linearVelocity.y = jumpHeight; // causes jump of one block at 8 gravity
				body.canJump = false;
				
			}
			
			// assumes vertical gravity
			if (movement == "swap") {
				
				body.m_userData.gravity.y = -Math.abs(body.m_userData.gravity.y);
				
			}
			
		}
		
		if (body.right) {
			
			body.m_linearVelocity.x += thrust;
			
		}
		
		if (body.down) {
			
			if (movement == "fly") body.m_linearVelocity.y += thrust;
			
			// assumes vertical gravity
			if (movement == "swap") {
				
				body.m_userData.gravity.y = Math.abs(body.m_userData.gravity.y);
				
			}
			
		}
		
		
		
		// movespeed caps
		if (body.m_linearVelocity.x < -cap) body.m_linearVelocity.x = -cap;
		if (body.m_linearVelocity.x >  cap) body.m_linearVelocity.x =  cap;
		if (body.m_linearVelocity.y < Math.min(-cap, jumpHeight)) body.m_linearVelocity.y = Math.min(-cap, jumpHeight); // preserve jump height, even if you run slow.
		if (body.m_linearVelocity.y > maxFallSpeed) body.m_linearVelocity.y =  maxFallSpeed;
		
		// records fall time
		// only works properly for downward gravity right now.
		if (movement == "jump" && !body.fallTimer && body.m_linearVelocity.y == maxFallSpeed) {
			
			body.fallTimer = Math.round(new Date().getTime() / 1000);
			
		}
		
		if (body.fallTimer) { // this check only exists to prevent calling new Date() every time, not sure how expensive that would be.
			
			// if you've fallen more than five seconds
			if (Math.round(new Date().getTime() / 1000) - body.fallTimer > 2) destroyTile(body);
			
		}
		
	}
	
}

function set_default_options() {
	
	if (!(options.background)) {options.background = ["navy", "aqua"];}
	
}

function keydownInput(event) {
	
	var key = event.keyCode;
		
	// stopEvent prevents camera from twitching in Firefox.
	if (key == 65) {
	
		players[0].left  = true;
		// don't change facing direction if shooting
		if (!players[0].isShooting) players[0].face = -1;
		stopEvent(event);
		
	}
	
	if (key == 68) {
	
		players[0].right  = true;
		if (!players[0].isShooting) players[0].face = 1;
		stopEvent(event);
		
	}
	if (key == 87) {players[0].up    = true; stopEvent(event);}
	if (key == 83) {players[0].down  = true; stopEvent(event);}
	
	if (players[1]) {
		
		if (key == 37) {
		
			players[1].left = true;
			if (!players[1].isShooting) players[1].face = -1;
			stopEvent(event);
			
		}
		
		if (key == 39) {
		
			players[1].right = true;
			if (!players[1].isShooting) players[1].face = 1;
			stopEvent(event);
			
		}
		
		if (key == 38) {players[1].up    = true; stopEvent(event);}
		if (key == 40) {players[1].down  = true; stopEvent(event);}
		
		if (key == 32) {players[1].isShooting = true; stopEvent(event);}
		
	}
	
}

function keyupInput(event) {
	
	var key = event.keyCode;
	
	if (key == 65) {players[0].left  = false; stopEvent(event);}
	if (key == 87) {players[0].up    = false; stopEvent(event);}
	if (key == 68) {players[0].right = false; stopEvent(event);}
	if (key == 83) {players[0].down  = false; stopEvent(event);}
		
	if (players[1]) {
		
		if (key == 37) {players[1].left  = false; stopEvent(event);}
		if (key == 38) {players[1].up    = false; stopEvent(event);}
		if (key == 39) {players[1].right = false; stopEvent(event);}
		if (key == 40) {players[1].down  = false; stopEvent(event);}
		
		if (key == 32) {players[1].isShooting = false; stopEvent(event);}
		
	}
	
}

function mousedownInput(event) {
	
	if (event.button == 0) {players[0].isShooting = true; stopEvent(event);}
	
}

function mouseupInput(event) {
	
	if (event.button == 0) {players[0].isShooting = false; stopEvent(event);}
	
}

function mousemove(event) {
	
	// globals
	mX = event.clientX;
	mY = event.clientY;
	
}