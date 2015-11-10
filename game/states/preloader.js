var init = require('../init.js');

var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};




module.exports = Preloader;



Preloader.prototype = {

    preload: function() {
        this.asset = this.add.sprite((init.gameWidth() / 2) - 110, (init.gameHeight() / 2), 'preloader');

        this.fblogo = this.add.tileSprite((init.gameWidth() / 2) - 90, (init.gameHeight() / 2) - 90, 30, 11, 'fblogo');
        this.fblogo.scale.x = 6;
        this.fblogo.scale.y = 6;

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);

        this.load.image('menu', 'assets/menu.png');
        this.load.image('title', 'assets/title.png');

        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('lv2', 'assets/lv2.png');
        this.load.image('lv3', 'assets/lv3.png');
        this.load.image('lv4', 'assets/lv4.png');

        this.load.image('road', 'assets/road.png');

        this.load.image('floor1', 'assets/floor1.png');
        this.load.image('floor2', 'assets/floor2.png');
        this.load.image('floor3', 'assets/floor3.png');
        this.load.image('floor4', 'assets/floor4.png');

        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        this.load.image('truck', 'assets/truck.png');
        this.load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        this.load.image('over', 'assets/over.png');
        this.load.image('retry', 'assets/retry.png');
    },

    create: function() {
        this.asset.cropEnabled = false;
    },

    update: function() {
        if (!!this.ready) {
            this.game.state.start('Menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};