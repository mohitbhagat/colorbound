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
	shotTime: 0,
	health: 5,
	loop : false
};

function collidePlayer(x, y, w, h, callback) {
	if(x + w < player.x || player.x + player.width < x) return;
	if(y + h < player.y || player.y + player.height < y) return;

	callback();
}

function move(ent, x, y, collideX, collideY) {
	const SAMPLES = 5;

	var moveX = x / SAMPLES;
	var moveY = y / SAMPLES;

	for(var i = 0; i < SAMPLES; ++i) {
		if(!collideLevel(ent.x + moveX, ent.y, ent.width, ent.height)) {
			ent.x += moveX;
		} else {
			if(collideX) {
				collideX();
			}
			break;
		}
	}

	for(var i = 0; i < SAMPLES; ++i) {
		if(!collideLevel(ent.x, ent.y + moveY, ent.width, ent.height)) {
			ent.y += moveY;
		} else {
			if(collideY) {
				collideY();
			}
			break;
		}
	}
}

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
	var shootRed = 90 in keysDown;
	var shootBlue = 88 in keysDown;
	var shootYellow = 67 in keysDown;

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

	var offX = player.flipped ? -20 : 60;
	var offY = 45;

	if(shootRed && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_RED, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = 0.6;
		shakeMag = 10;
		shakeTimer = 0.15;
	}

	if(shootBlue && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_BLUE, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = 0.6;
		shakeMag = 10;
		shakeTimer = 0.15;
	}

	if(shootYellow && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_YELLOW, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = 0.6;
		shakeMag = 10;
		shakeTimer = 0.15;
	}

	if(player.shotTime > 0) {
		player.shotTime -= dt;
	}

	move(player, player.dx, player.dy, function() {
		player.dx = 0;
	}, function() {
		player.dy = 0;
	});

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
