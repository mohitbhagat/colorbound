// colorbound

var canvas = null;
var ctx = null;

var keysDown = {};

var level = TileMaps["level"];

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

	pixelated(ctx);

	document.addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;
	});

	document.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
	});

	for(var i = 0; i < level.layers.length; ++i) {
		var layer = level.layers[i];

		if(layer.name == "Entities") {
			for(var i = 0; i < layer.objects.length; ++i) {
				var object = layer.objects[i];

				if(object.type == "player") {
					player.x = object.x;
					player.y = object.y;
				}
			}
		}
	}

	createEnemy(0, 300, 200);
	createEnemy(0, 600, 300);
	createEnemy(0, 800, 150);
	console.log("enemies loaded: " + enemies.length);
}

function update(dt) {
	updatePlayer(dt);
	updateEnemies(dt);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#00001D";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if(groundReady) {
		for(var i = 0; i < level.layers.length; ++i) {
			var layer = level.layers[i];

			if(layer.type == "tilelayer") {
				for(var y = 0; y < layer.height; ++y) {
					for(var x = 0; x < layer.width; ++x) {
						var tile = layer.data[x + y * layer.width];
						if(tile > 0) {
							tile -= 1;
							var columns = ground.width / level.tilewidth;
							var u = tile % columns;
							var v = Math.floor(tile / columns);
							ctx.drawImage(ground, u * level.tilewidth, v * level.tileheight, level.tilewidth, level.tileheight,
								x * level.tilewidth, y * level.tileheight, level.tilewidth, level.tileheight);
						}
					}
				}
			}
		}
	}

	drawPlayer();
	drawEnemies();
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
