// colorbound

var canvas = null;
var ctx = null;

var keysDown = {};

var playerImage = new Image();
var playerReady = false;

playerImage.onload = function() {
    playerReady = true;
}

playerImage.src = "graphics/player1.png";

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : 20,
	height : 125
};

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
	} else if(right) {
		player.dx = 400 * dt;
	} else {
		player.dx = 0;
	}

	player.dy += 16 * dt;

	player.x += player.dx;
	player.y += player.dy;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#00001D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
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
