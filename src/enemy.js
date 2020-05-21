var enemies = [];

const ENEMY_WIDTH = 58;
const ENEMY_HEIGHT = 87;

const ENEMY_SPRITE_OFF_X = 41;
const ENEMY_SPRITE_OFF_Y = 18;

const ENEMY_SHOOT_COOLDOWN = 1;
const ENEMY_CHASE_SPEED = 8;

function createEnemy(type, x, y) {
    enemies.push({
        type : type,
        x : x,
        y : y,
        dx : 0,
        dy : 0,
        width : ENEMY_WIDTH,
        height : ENEMY_HEIGHT,
        dir : 1,
        frameIndex : 0,
        frames : ENEMY_ANIM_IDLE,
        loop : true,
        animTimer : 0,
        frameTime : 0,
        shootTimer : 0
    });
}

function updateEnemies(dt) {
    for(var i = 0; i < enemies.length; ++i) {
        var enemy = enemies[i];

        if(enemy.x < player.x) {
            enemy.dir = 1;
        } else {
            enemy.dir = -1;
        }

        var dist2 = distanceSqr(enemy.x, enemy.y, player.x, player.y);

        var angle = Math.atan2((player.y + player.height / 2) - (enemy.y + enemy.height / 2), (player.x + player.width / 2) - (enemy.x + enemy.width / 2));

        enemy.dx = Math.cos(angle) * ENEMY_CHASE_SPEED * dt;
        enemy.dy = Math.sin(angle) * ENEMY_CHASE_SPEED * dt;

        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        enemy.shootTimer -= dt;
        if(enemy.shootTimer <= 0) {
            enemy.shootTimer = ENEMY_SHOOT_COOLDOWN;
            shootRocket(enemy.x + enemy.width / 2 - ROCKET_WIDTH / 2, enemy.y + enemy.height / 2 - ROCKET_HEIGHT / 2, angle);
            console.log("enemy shooting at angle", angle);
        }

        enemy.frames = ENEMY_ANIM_MOVE;
        enemy.frameTime = 1 / 3;

        if(enemy.frames) {
            enemy.frameIndex = Math.floor(enemy.animTimer / enemy.frameTime);
            if(enemy.frameIndex >= enemy.frames.length) {
                if(enemy.loop) {
                    enemy.frameIndex = 0;
                    enemy.animTimer = 0;
                } else {
                    enemy.frameIndex = enemy.frames.length - 1;
                }
            }

            enemy.animTimer += dt;
        }
    }
}

function drawEnemies() {
    if(enemyReady) {
        for(var i = 0; i < enemies.length; ++i) {
            var enemy = enemies[i];

            var px = enemy.x - camera.x - ENEMY_SPRITE_OFF_X;
            var py = enemy.y - camera.y - ENEMY_SPRITE_OFF_Y;

            if(enemy.frames) {
                drawFrame(enemyImage, px, py, enemy.frames[enemy.frameIndex], ENEMY_FRAME_WIDTH, ENEMY_FRAME_HEIGHT, enemy.dir < 0);
            }
        }
    }
}
