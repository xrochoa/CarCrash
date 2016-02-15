'use strict';

//state and shortcuts
var preloaderState, game, load, add;

//sprites, audio and events
var fridgeBingeLogo, progressBar;

var Preloader = function() {};

Preloader.prototype = {

    preload: function() {

        //variables
        preloaderState = this;
        load = preloaderState.load;

        //set background logo and progress bar
        preloaderState.setProgressLogo();

        //LOAD GAME ASSETS
        //menu
        load.image('menuBg', 'assets/menu.png');
        load.image('title', 'assets/title.png');
        //color backgrounds
        load.spritesheet('bground', 'assets/backgrounds.png', 30, 60, 4); // size 30x60 and 4 frames
        //level backgrounds
        load.image('lv1', 'assets/lv1.png');
        load.image('lv2', 'assets/lv2.png');
        load.image('lv3', 'assets/lv3.png');
        load.image('lv4', 'assets/lv4.png');
        //road
        load.image('road', 'assets/road.png');
        //floor backgrounds
        load.image('floor1', 'assets/floor1.png');
        load.image('floor2', 'assets/floor2.png');
        load.image('floor3', 'assets/floor3.png');
        load.image('floor4', 'assets/floor4.png');
        //sprites
        load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        load.image('truck', 'assets/truck.png');
        load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        load.image('over', 'assets/over.png');
        load.image('retry', 'assets/retry.png');
        //sounds
        load.audio('themeSong', 'assets/themesong.m4a');
        //winner
        load.image('winback', 'assets/winback.png');
        load.image('wintitle', 'assets/wintitle.png');

        //COMPLETED LISTENER: call method on load completed
        load.onLoadComplete.add(preloaderState.onLoadComplete, preloaderState);

    }

};

//CUSTOM METHODS (for modularity)
Preloader.prototype.setProgressLogo = function() {
    
    //variables
    game = preloaderState.game;
    add = preloaderState.add;

    //place logo and progress bar
    fridgeBingeLogo = add.tileSprite((game.init.gameWidth() / 2) - 90, (game.init.gameHeight() / 2) - 90, 30, 11, 'fblogo');
    fridgeBingeLogo.scale.x = 6;
    fridgeBingeLogo.scale.y = 6;

    progressBar = add.sprite((game.init.gameWidth() / 2) - 110, (game.init.gameHeight() / 2), 'preloader');
    progressBar.cropEnabled = false;

    //loads progress bar
    load.setPreloadSprite(progressBar);

};

Preloader.prototype.onLoadComplete = function() {
    preloaderState.state.start('Menu');
};

module.exports = Preloader;