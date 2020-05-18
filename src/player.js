var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : 20,
	height : 125,
	grounded : false,
	frameIndex : 0,
	frameTimer : 0,
	running : false,
	flipped : false
};

function updatePlayer(dt) {
	if(collideLevel(player.x, player.y + 1, player.width, player.height)) {
		player.grounded = true;
		player.dy = 0;
	} else {
		player.grounded = false;
		player.dy += 16 * dt;
	}

	var left = 37 in keysDown;
	var right = 39 in keysDown;
	var jump = 38 in keysDown;

	if(jump && player.grounded) {
		player.grounded = false;
		player.dy = -10;
	}

	if(left) {
		player.flipped = true;
		player.dx = -400 * dt;
		player.running = true;
	} else if(right) {
		player.flipped = false;
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

	if(!collideLevel(player.x + player.dx, player.y, player.width, player.height)) {
		player.x += player.dx;
	}
	if(!collideLevel(player.x, player.y + player.dy, player.width, player.height)) {
		player.y += player.dy;
	} else {
		player.dy = 0;
	}
}

function drawPlayer() {
	if(player.running) {
		drawFrame(runFrames[player.frameIndex], player.x - camera.x, player.y - camera.y);
	} else {
		if(playerReady) {
			drawFrame(playerImage, player.x - camera.x, player.y - camera.y);
		}
	}
}
