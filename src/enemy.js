var enemies = [];

function createEnemy(type, x, y) {
    enemies.push({
        type : type,
        x : x,
        y : y,
        dx : 0,
        dy : 0,
        width : 64,
        height : 64,
        dir : 1
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
    }
}

function drawEnemies() {
    if(monsterReady) {
        for(var i = 0; i < enemies.length; ++i) {
            var enemy = enemies[i];
            ctx.drawImage(monsterImage, enemy.x - camera.x, enemy.y - camera.y);
        }
    }
}
