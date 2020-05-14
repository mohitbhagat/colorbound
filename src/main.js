// colorbound

var canvas = null;
var ctx = null;

var keysDown = {};

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : 20,
	height : 125,
	frameIndex : 0,
	frameTimer : 0,
	running : false
};

var level = TileMaps["level"];

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

	createEnemy(0, 300, 200);
	createEnemy(0, 600, 300);
	createEnemy(0, 800, 150);
	console.log("enemies loaded: " + enemies.length);
}

function update(dt) {
	var left = 37 in keysDown;
	var right = 39 in keysDown;
	var jump = 38 in keysDown;

	if(left) {
		player.dx = -400 * dt;
		player.running = true;
	} else if(right) {
		player.dx = 400 * dt;
		player.running = true;
	} else {
		player.dx = 0;
		player.running = false;
	}

	if(player.running) {
		player.frameTimer += dt;
		if(player.frameTimer > 0.05) {
			player.frameIndex = (player.frameIndex + 1) % runFrames.length;
			player.frameTimer = 0;
		}
	} else {
		player.frameIndex = 0;
	}

	player.dy += 16 * dt;

	player.x += player.dx;
	player.y += player.dy;

	updateEnemies(dt);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#00001D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(groundReady) {
		for(var i = 0; i < level.layers.length; ++i) {
			var layer = level.layers[i];

			if(layer.type == "tilelayer") {
				for(var y = 0; y < layer.height; ++y) {
					for(var x = 0; x < layer.width; ++x) {
						var tile = layer.data[x + y * layer.width];
						if(tile > 0) {
							tile -= 1;
							var columns = ground.width / level.tilewidth;
							var u = tile % columns;
							var v = Math.floor(tile / columns);
							ctx.drawImage(ground, u * level.tilewidth, v * level.tileheight, level.tilewidth, level.tileheight,
								x * level.tilewidth, y * level.tileheight, level.tilewidth, level.tileheight);
						}
					}
				}
			}
		}
	}

	if(player.running) {
		drawFrame(runFrames[player.frameIndex], player.x, player.y);
	} else {
		if(playerReady) {
			drawFrame(playerImage, player.x, player.y);
		}
	}

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
