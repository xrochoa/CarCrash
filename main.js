var pixelScale = 10;

var gameSpeed = 0.5,
    gameSpeedSlower = gameSpeed / 2,
    gameSpeedSlowest = gameSpeed / 25;

var gameOver = false;

//lane1, lane 2 and middle lane
var lanes = [36 * pixelScale, 42 * pixelScale, 40.5 * pixelScale];

var gameInit = false;
var gravity = -35 * pixelScale;
var carPedal = 10 * pixelScale;

var enemies;
var enemySpeed = 300;

var gameWidth = 30 * pixelScale;
var gameHeight = 60 * pixelScale;

var score = 0;


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv', null, false, false);
game.state.add('main', mainState);
game.state.add('mainMenu', mainMenu);
game.state.start('mainMenu');