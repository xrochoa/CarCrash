'use strict';

var init = require('./init.js');

window.game = new Phaser.Game(init.gameWidth(), init.gameHeight(), Phaser.CANVAS, 'gameDiv', null, false, false);

game.state.add('Boot', require('./states/boot.js'));
game.state.add('Preloader', require('./states/preloader.js'));

game.state.add('Menu', require('./states/menu.js'));
game.state.add('Game', require('./states/game.js'));
//start
game.state.start('Boot');


/*
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

var score = 0;*/