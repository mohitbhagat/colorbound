var groundReady = false;
var ground = new Image();

ground.onload = function() {
    groundReady = true;
}

ground.src = "graphics/ground.png";

var playerReady = false;
var playerImage = new Image();

playerImage.onload = function() {
    playerReady = true;
}

playerImage.src = "graphics/player1.png";

var run1 = new Image(); run1.src = "graphics/run1.png";
var run2 = new Image(); run2.src = "graphics/run2.png";
var run3 = new Image(); run3.src = "graphics/run3.png";
var run4 = new Image(); run4.src = "graphics/run4.png";
var run5 = new Image(); run5.src = "graphics/run5.png";
var run6 = new Image(); run6.src = "graphics/run6.png";
var run7 = new Image(); run7.src = "graphics/run7.png";
var run8 = new Image(); run8.src = "graphics/run8.png";
var runFrames = [run1, run2, run3, run4, run5, run6, run7, run8];

var jump1 = new Image(); jump1.src = "graphics/jump 1.png";
var jump2 = new Image(); jump2.src = "graphics/jump 2.png";
var jump3 = new Image(); jump3.src = "graphics/jump 3.png";
var jump4 = new Image(); jump4.src = "graphics/jump 4.png";
var jump5 = new Image(); jump5.src = "graphics/jump 5.png";
var jump6 = new Image(); jump6.src = "graphics/jump 6.png";
var jump7 = new Image(); jump7.src = "graphics/jump 7.png";
var jump8 = new Image(); jump8.src = "graphics/jump 8.png";
var jumpFrames = [jump1, jump2, jump3, jump4, jump5, jump6, jump7, jump8];

var monsterReady = false;
var monsterImage = new Image();

monsterImage.onload = function() {
    monsterReady = true;
}

monsterImage.src = "graphics/monster.png";

var starReady = false;
var starImage = new Image();

starImage.onload = function() {
    starReady = false;
}

starImage.src = "graphics/star.png";
