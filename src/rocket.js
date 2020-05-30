var rockets = [];

const ROCKET_SPEED = 500;
const ROCKET_SIZE = 8;
const ROCKET_STEER_FACTOR = 5;

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

        collidePlayer(rocket.x, rocket.y, ROCKET_WIDTH, ROCKET_HEIGHT, function() {
            addExplosion(rocket.x - EXPLOSION_FRAME_WIDTH / 2, rocket.y - EXPLOSION_FRAME_HEIGHT / 2);
            rockets.splice(i, 1);
            player.health -= 1;
        });

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
