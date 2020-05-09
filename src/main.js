// colorbound

var canvas = null;
var ctx = null;

var keysDown = {};

var playerImage = new Image();
var playerReady = false;
playerImage.onload = function() { playerReady = true; }
playerImage.src = "graphics/player1.png";

var run1 = new Image(); run1.src = "graphics/run1.png";
var run2 = new Image(); run2.src = "graphics/run2.png";
var run3 = new Image(); run3.src = "graphics/run3.png";
var run4 = new Image(); run4.src = "graphics/run4.png";
var run5 = new Image(); run5.src = "graphics/run5.png";
var run6 = new Image(); run6.src = "graphics/run6.png";
var run7 = new Image(); run7.src = "graphics/run7.png";
var run8 = new Image(); run8.src = "graphics/run8.png";
var runFrames = [run1, run2, run3, run4, run5, run6, run7, run8];

var jump1 = new Image(); jump1.src = "graphics/jump 1.png";
var jump2 = new Image(); jump2.src = "graphics/jump 2.png";
var jump3 = new Image(); jump3.src = "graphics/jump 3.png";
var jump4 = new Image(); jump4.src = "graphics/jump 4.png";
var jump5 = new Image(); jump5.src = "graphics/jump 5.png";
var jump6 = new Image(); jump6.src = "graphics/jump 6.png";
var jump7 = new Image(); jump7.src = "graphics/jump 7.png";
var jump8 = new Image(); jump8.src = "graphics/jump 8.png";
var jumpFrames = [jump1, jump2, jump3, jump4, jump5, jump6, jump7, jump8];

var groundReady = false;
var ground = new Image();
ground.onload = function() { groundReady = true; }
ground.src = "graphics/ground.png";

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

	document.addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;
	});

	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
	});
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
		ctx.drawImage(runFrames[player.frameIndex], player.x, player.y);
	} else {
		if(playerReady) {
			ctx.drawImage(playerImage, player.x, player.y);
		}
	}
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
