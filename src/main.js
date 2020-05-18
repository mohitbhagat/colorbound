// colorbound

var canvas = null;
var ctx = null;

var keysDown = {};

var camera = {
	x : 0,
	y : 0
};

var level = TileMaps["level"];
var collisionLayer = (function() {
	for(var i = 0; i < level.layers.length; ++i) {
		var layer = level.layers[i];
		if(layer.name == "Main") {
			return layer;
		}
	}

	return null;
})();

const CAMERA_SPEED_FACTOR = 5;

function collideLevel(x, y, w, h) {
	var left = Math.floor(x / level.tilewidth);
	var top = Math.floor(y / level.tileheight);
	var right = Math.ceil((x + w) / level.tilewidth);
	var bottom = Math.ceil((y + h) / level.tileheight);

	if(right < left) {
		var tmp = left;
		left = right;
		right = tmp;
	}

	if(bottom < top) {
		var tmp = top;
		top = bottom;
		bottom = tmp;
	}

	for(var y = top; y < bottom; ++y) {
		for(var x = left; x < right; ++x) {
			if(collisionLayer.data[x + y * level.width] > 0) {
				return true;
			}
		}
	}

	return false;
}

function init() {
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	canvas.width = 960;
	canvas.height = 720;

	canvas.style["position"] = "fixed";
	canvas.style["top"] = "50%";
	canvas.style["left"] = "50%";
	canvas.style["transform"] = "translate(-50%, -50%)";
	canvas.style["border"] = "solid";

	ctx = canvas.getContext("2d");

	pixelated(ctx);

	document.addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;
	});

	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
	});

	for(var i = 0; i < level.layers.length; ++i) {
		var layer = level.layers[i];

		if(layer.name == "Entities") {
			for(var i = 0; i < layer.objects.length; ++i) {
				var object = layer.objects[i];

				if(object.type == "player") {
					player.x = object.x;
					player.y = object.y;
				}
			}
		}
	}

	createEnemy(0, 300, 200);
	createEnemy(0, 600, 300);
	createEnemy(0, 800, 150);
	console.log("enemies loaded: " + enemies.length);
}

function update(dt) {
	camera.x += (player.x + player.width / 2 - canvas.width / 2 - camera.x) * dt * CAMERA_SPEED_FACTOR;
	camera.y += (player.y + player.height / 2 - canvas.height / 2 - camera.y) * dt * CAMERA_SPEED_FACTOR;

	updatePlayer(dt);
	updateEnemies(dt);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	camera.x = Math.floor(camera.x);
	camera.y = Math.floor(camera.y);

	ctx.fillStyle = "#00001D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(groundReady) {
		var left = Math.floor(camera.x / level.tilewidth);
		var top = Math.floor(camera.y / level.tileheight);
		var right = Math.ceil((camera.x + canvas.width) / level.tilewidth);
		var bottom = Math.ceil((camera.y + canvas.height) / level.tileheight);

		for(var i = 0; i < level.layers.length; ++i) {
			var layer = level.layers[i];

			if(layer.type == "tilelayer") {
				for(var y = top; y < bottom; ++y) {
					if(y < 0 || y >= layer.height) continue;

					for(var x = left; x < right; ++x) {
						if(x < 0 || x >= layer.width) continue;

						var tile = layer.data[x + y * layer.width];
						if(tile > 0) {
							tile -= 1;
							var columns = ground.width / level.tilewidth;
							var u = tile % columns;
							var v = Math.floor(tile / columns);
							ctx.drawImage(ground, u * level.tilewidth, v * level.tileheight, level.tilewidth, level.tileheight,
								x * level.tilewidth - camera.x, y * level.tileheight - camera.y, level.tilewidth, level.tileheight);
						}
					}
				}
			}
		}
	}

	drawPlayer();
	drawEnemies();
}

var then = Date.now();

function loop() {
	var now = Date.now();
	var delta = (now - then) / 1000;

	update(delta);
	draw();

	then = now;

	requestAnimationFrame(loop);
}

init();
loop();
