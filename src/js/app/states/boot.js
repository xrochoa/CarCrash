'use strict';

var Boot = function() {};

//'this' is the Boot state that has a reference to game as a property
Boot.prototype = {

    preload: function() {
        this.game.load.image('preloader', 'assets/preloader.png');
        this.game.load.image('fblogo', 'assets/fblogow.png');
    },

    create: function() {
        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;
            this.game.scale.maxWidth = 640;
            this.game.scale.maxHeight = 480;
            this.game.scale.forceLandscape = true;
            this.game.scale.pageAlignHorizontally = true;
        }

        this.game.state.start('Preloader');

    }
};

module.exports = Boot;