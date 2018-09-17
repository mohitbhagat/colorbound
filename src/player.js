"use strict";

const PLAYER_START_AMMO = 3;
const PLAYER_SHOT_TIME = 0.6;
const PLAYER_START_HEALTH = 5;
const PLAYER_TERMINAL_VEL = 1000;

const PLAYER_SPRITE_OFF_X = 48;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 125;

const PLAYER_GUN_OFF_X = 60;
const PLAYER_GUN_OFF_Y = 45;

var player = {
	x : 100,
	y : 100,
	dx : 0,
	dy : 0,
	width : PLAYER_WIDTH,
	height : PLAYER_HEIGHT,
	grounded : false,
	frameIndex : 0,
	anim : PLAYER_ANIM_STAND,
	animTimer : 0,
	animFrameTime : 1 / 12,
	flipped : false,
    jumped : false,
	shotTime: 0,
	ammo : PLAYER_START_AMMO,
	health: PLAYER_START_HEALTH,
	loop : false,
	doubleJumped : false,
	/*beatTimer : 0,
	beats : [],
	lastBeatIndex : -1*/
};

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

function collidePlayer(x, y, w, h, callback) {
	if(x + w < player.x || player.x + player.width < x) return;
	if(y + h < player.y || player.y + player.height < y) return;

	callback();
}

function updatePlayer(dt) {
	if(collideLevel(player.x, player.y + 1, player.width, player.height)) {
		player.grounded = true;
        player.jumped = false;
		player.doubleJumped = false;
		player.dy = 0;
	} else {
		player.grounded = false;
		player.dy += 16 * dt;
	}
	
	var doEcho = 32 in keysJustPressed;
	var left = (37 in keysDown) || (65 in keysDown);
	var right = (39 in keysDown) || (68 in keysDown);
	var jump = (38 in keysJustPressed) || (87 in keysJustPressed);
	var up = (38 in keysDown) || (87 in keysDown);
    var down = (40 in keysDown) || (83 in keysDown);
	var shootRed = (90 in keysDown) || (74 in keysDown);
	var shootBlue = (88 in keysDown) || (75 in keysDown);
	var shootYellow = (67 in keysDown) || (76 in keysDown);

	if(jump) {
		if(player.grounded) {
			player.grounded = false;
			player.jumped = true;
			player.doubleJumped = false;
			player.dy = -10;
		} else {
			if(!player.doubleJumped) {
				player.doubleJumped = true;
				player.dy = -10;
			}
		}
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

	var offX = player.flipped ? -(PLAYER_GUN_OFF_X - PLAYER_SPRITE_OFF_X) : PLAYER_GUN_OFF_X;
	var offY = PLAYER_GUN_OFF_Y;

	if(shootRed && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_RED, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = PLAYER_SHOT_TIME;
		shakeMag = 10;
		shakeTimer = 0.15;
		redSound.play();
	}

	if(shootBlue && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_BLUE, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = PLAYER_SHOT_TIME;
		shakeMag = 10;
		shakeTimer = 0.15;
		blueSound.play();
	}

	if(shootYellow && player.shotTime <= 0) {
		shootWave(WAVE_SHOT_YELLOW, player.x + offX, player.y + offY, player.flipped ? -1 : 1);
		player.shotTime = PLAYER_SHOT_TIME;
		shakeMag = 10;
		shakeTimer = 0.15;
		yellowSound.play();
	}

	if(player.shotTime > 0) {
		player.shotTime -= dt;
	}

	if(Math.abs(player.dy) >= PLAYER_TERMINAL_VEL * dt) {
		player.dy = Math.sign(player.dy) * PLAYER_TERMINAL_VEL * dt;
	}

	if(doEcho && !echo.active && player.ammo > 0) {
		echo.active = true;
		echo.radius = 0;
		echo.timer = ECHO_TIME;
		echo.x = player.x + player.width / 2;
		echo.y = player.y + player.height / 2;
		player.ammo -= 1;
		dingSound.play();

		shakeMag = 20;
		shakeTimer = 0.3;
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
		drawFrame(playerImage, player.x - camera.x - PLAYER_SPRITE_OFF_X, player.y - camera.y, player.anim[player.frameIndex], PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT, player.flipped);
	}

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";

	for(var i = 0; i < player.health; ++i) {
		ctx.drawImage(heartImage, i * heartImage.width, 0);
	}

	ctx.drawImage(ammoImage, 0, heartImage.height + 10);
	ctx.fillText("" + player.ammo, ammoImage.width + 5, heartImage.height + 10 + ammoImage.height / 2);

	ctx.fillText("Wave: " + spawnLevel, 0, heartImage.height + 10 + ammoImage.height + 30);
	ctx.fillText("Enemies: " + enemies.length, 0, heartImage.height + 10 + ammoImage.height + 60);
	ctx.fillText("Enemies Killed: " + enemiesKilled, 0, heartImage.height + 10 + ammoImage.height + 90);
}