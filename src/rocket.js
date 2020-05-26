var rockets = [];

const ROCKET_SPEED = 500;
const ROCKET_SIZE = 8;

const ROCKET_WIDTH = 64;
const ROCKET_HEIGHT = 64;

function shootRocket(x, y, angle) {
    rockets.push({
        x : x,
        y : y,
        angle : angle
    });
}

function updateRockets(dt) {
    for(var i = 0; i < rockets.length; ++i) {
        var rocket = rockets[i];

        var dist2player = distanceSqr(player.x + player.width / 2, player.y + player.height / 2, rocket.x, rocket.y);

        if(dist2player < 32 * 32) {
            addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
            rockets.splice(i, 1);
        }

        if(collideLevel(rocket.x, rocket.y, ROCKET_WIDTH, ROCKET_HEIGHT)) {
            addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
            rockets.splice(i, 1);
        }

        rocket.x += Math.cos(rocket.angle) * ROCKET_SPEED * dt;
        rocket.y += Math.sin(rocket.angle) * ROCKET_SPEED * dt;
    }
}

function drawRockets() {
    if(rocketReady) {
        for(var i = 0; i < rockets.length; ++i) {
            var rocket = rockets[i];

            ctx.save();

            ctx.translate(rocket.x - camera.x, rocket.y - camera.y);

            ctx.translate(rocketImage.width / 2, rocketImage.height / 2);
            ctx.rotate(rocket.angle);
            ctx.translate(-rocketImage.width / 2, -rocketImage.height / 2);

            ctx.drawImage(rocketImage, 0, 0);

            ctx.restore();
        }
    }
}
