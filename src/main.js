// colorbound

var canvas = null;
var ctx = null;

var playerImage = new Image();
var playerReady = false;

playerImage.onload = function() {
    playerReady = true;
}

playerImage.src = "graphics/player1.png";

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
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#00001D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(playerReady) {
		ctx.drawImage(playerImage, 100, 100);
	}
}

init();
draw();
