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

var shakeMag = 2;
var shakeTimer = 0;

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

function drawFrame(image, x, y, frame, fw, fh, flip, scaleX, scaleY) {
	scaleX = scaleX || 1;
	scaleY = scaleY || 1;

	var columns = image.width / fw;

	var u = frame % columns;
	var v = Math.floor(frame / columns);

	if(!flip) {
		ctx.drawImage(image, u * fw, v * fh, fw, fh, x, y, fw * scaleX, fh * scaleY);
	} else {
		ctx.save();

		ctx.translate(x + fw, y);
		ctx.scale(-1, 1);

		ctx.drawImage(image, u * fw, v * fh, fw, fh, 0, 0, fw, fh);

		ctx.restore();
	}
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

	createEnemy(0, 300, 200, WAVE_SHOT_RED);
	createEnemy(0, 600, 300, WAVE_SHOT_BLUE);
	createEnemy(0, 800, 150, WAVE_SHOT_YELLOW);
}

function update(dt) {
	camera.x += (player.x + player.width / 2 - canvas.width / 2 - camera.x) * dt * CAMERA_SPEED_FACTOR;
	camera.y += (player.y + player.height / 2 - canvas.height / 2 - camera.y) * dt * CAMERA_SPEED_FACTOR;

	if(shakeTimer > 0) {
		camera.x += Math.random() * (shakeMag * 2) - shakeMag;
		camera.y += Math.random() * (shakeMag * 2) - shakeMag;

		shakeTimer -= dt;
	}

	updateEnemies(dt);
	updateRockets(dt);
	updatePlayer(dt);
	updateWaves(dt);
	updateExplosions(dt);
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
							drawFrame(ground, x * level.tilewidth - camera.x, y * level.tileheight - camera.y, tile, level.tilewidth, level.tileheight, false);
						}
					}
				}
			}
		}
	}

	drawPlayer();
	drawWaves();
	drawEnemies();
	drawRockets();
	drawExplosions();
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
