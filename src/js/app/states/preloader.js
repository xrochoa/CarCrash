'use strict';

var Preloader = function(game) {
    this.ready = false;
};

Preloader.prototype = {

    preload: function() {

        //set background logo and progress bar
        this.setProgressLogo();

        //menu
        this.load.image('menu', 'assets/menu.png');
        this.load.image('title', 'assets/title.png');
        //color backgrounds
        this.load.spritesheet('bground', 'assets/backgrounds.png', 30, 60, 4); // size 30x60 and 4 frames
        //level backgrounds
        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('lv2', 'assets/lv2.png');
        this.load.image('lv3', 'assets/lv3.png');
        this.load.image('lv4', 'assets/lv4.png');
        //road
        this.load.image('road', 'assets/road.png');
        //floor backgrounds
        this.load.image('floor1', 'assets/floor1.png');
        this.load.image('floor2', 'assets/floor2.png');
        this.load.image('floor3', 'assets/floor3.png');
        this.load.image('floor4', 'assets/floor4.png');
        //sprites
        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        this.load.image('truck', 'assets/truck.png');
        this.load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        this.load.image('over', 'assets/over.png');
        this.load.image('retry', 'assets/retry.png');
        //sounds
        this.load.audio('themesong', 'assets/themesong.m4a');
        //winner
        this.load.image('winback', 'assets/winback.png');
        this.load.image('wintitle', 'assets/wintitle.png');

        //call method on load completed
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);


    },

    update: function() {
        if (!!this.ready) {
            this.game.state.start('Menu');
        }
    },

};

//CUSTOM METHODS
Preloader.prototype.setProgressLogo = function() {
    //place logo and asset
    this.progress = this.add.sprite((this.game.init.gameWidth() / 2) - 110, (this.game.init.gameHeight() / 2), 'preloader');
    this.fblogo = this.add.tileSprite((this.game.init.gameWidth() / 2) - 90, (this.game.init.gameHeight() / 2) - 90, 30, 11, 'fblogo');
    this.fblogo.scale.x = 6;
    this.fblogo.scale.y = 6;
    //loads progress bar
    this.progress.cropEnabled = false;
    this.load.setPreloadSprite(this.progress);
};

Preloader.prototype.onLoadComplete = function() {
    this.ready = true;
};

module.exports = Preloader;