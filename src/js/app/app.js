'use strict';

(function() {

    //DEPENDENCIES

    //initial game values
    var init = require('./init.js');
    //utilities
    var utils = require('./utils.js');
    //states
    var boot = require('./states/boot.js'); //phaser configuration
    var preloader = require('./states/preloader.js'); //asset loading
    var menu = require('./states/menu.js'); //game menu
    var gameState = require('./states/game.js'); //game logic
    var win = require('./states/win.js'); //end of game


    //use Phaser or throw error
    var Phaser = window.Phaser ? window.Phaser : undefined;
    if (Phaser === undefined) {
        throw new Error('Phaser didn\'t load correctly. Please reload the website.');
    }

    //initialize game
    var game = new Phaser.Game(init.gameWidth(), init.gameHeight(), Phaser.CANVAS, 'gameDiv', null, false, false);

    //extending game with utilities
    game.utils = utils;
    //extending game with initial game values
    game.init = init;

    //game states
    game.state.add('Boot', boot);
    game.state.add('Preloader', preloader);
    game.state.add('Menu', menu);
    game.state.add('Game', gameState);
    game.state.add('Win', win);


    //launch boot state
    game.state.start('Boot');

})();