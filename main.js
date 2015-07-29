var pixelScale = 15;

var gameSpeed = 0.5,
    gameSpeedSlower = gameSpeed / 2,
    gameSpeedSlowest = gameSpeed / 25;

var gameOver = false;

var lane1 = 36 * pixelScale,
    lane2 = 42 * pixelScale,
    middleLane = 40.5 * pixelScale

var gameInit = false;
var gravity = -35 * pixelScale;
var carPedal = 10 * pixelScale;

var enemies;
var enemySpeed = 300;

var gameWidth = 30 * pixelScale;
var gameHeight = 60 * pixelScale;


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv', null, false, false);
game.state.add('main', mainState);
game.state.add('mainMenu', mainMenu);
game.state.start('mainMenu');
