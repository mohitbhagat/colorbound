var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : 20,
	height : 125,
	grounded : false,
	frameIndex : 0,
	anim : PLAYER_ANIM_STAND,
	animTimer : 0,
	animFrameTime : 1 / 12,
	flipped : false,
    jumped : false,
	loop : false
};

function updatePlayer(dt) {
	if(collideLevel(player.x, player.y + 1, player.width, player.height)) {
		player.grounded = true;
        player.jumped = false;
		player.dy = 0;
	} else {
		player.grounded = false;
		player.dy += 16 * dt;
	}

	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var jump = 38 in keysDown;

	if(jump && player.grounded) {
		player.grounded = false;
		player.jumped = true;
		player.dy = -10;
	}

	if(left) {
		player.flipped = true;
		player.anim = PLAYER_ANIM_RUN;
		player.animFrameTime = PLAYER_RUN_FRAME_TIME;
		player.loop = true;
		player.dx = -400 * dt;
	} else if(right) {
		player.flipped = false;
		player.anim = PLAYER_ANIM_RUN;
		player.animFrameTime = PLAYER_RUN_FRAME_TIME;
		player.loop = true;
		player.dx = 400 * dt;
	} else {
		player.dx = 0;
		player.anim = PLAYER_ANIM_STAND;
		player.animFrameTime = PLAYER_STAND_FRAME_TIME;
	}

	if(!player.grounded) {
		if(player.anim != PLAYER_ANIM_JUMP) {
			player.animTimer = 0;
		}

		player.anim = PLAYER_ANIM_JUMP;
		player.animFrameTime = PLAYER_JUMP_FRAME_TIME;
		player.loop = false;
	}

	if(!collideLevel(player.x + player.dx, player.y, player.width, player.height)) {
		player.x += player.dx;
	}
	if(!collideLevel(player.x, player.y + player.dy, player.width, player.height)) {
		player.y += player.dy;
	} else {
		player.dy = 0;
	}

	if(player.anim) {
		player.frameIndex = Math.floor(player.animTimer / player.animFrameTime);
		if(player.frameIndex >= player.anim.length) {
			if(player.loop) {
				player.frameIndex = 0;
				player.animTimer = 0;
			} else {
				player.frameIndex = player.anim.length - 1;
			}
		}

		player.animTimer += dt;
	}
}

function drawPlayer() {
	if(playerReady) {
		drawFrame(playerImage, player.x - camera.x, player.y - camera.y, player.anim[player.frameIndex], PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, player.flipped);
	}
}
