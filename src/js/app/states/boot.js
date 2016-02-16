'use strict';

//state and shortcuts
var bootState, game, load, scale;

var Boot = function() {};

//'this' is the Boot state that also has a reference to game as a property this.game (very similar)
Boot.prototype = {

    preload: function() {
        //variables
        bootState = this;
        load = bootState.load;

        load.image('preloader', 'assets/preloader.png');
        load.image('fblogo', 'assets/fblogow.png');
    },

    create: function() {
        //variables
        game = bootState.game;
        scale = bootState.scale;

        bootState.input.maxPointers = 1;

        if (game.device.desktop) {
            scale.pageAlignHorizontally = true;
            scale.pageAlignVertically = true;
            scale.refresh();
        } else {
            scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            scale.minWidth = window.innerHeight / 1.5;
            scale.minHeight = window.innerHeight;
            scale.maxWidth = window.innerHeight / 1.5;
            scale.maxHeight = window.innerHeight;
            scale.forceLandscape = true;
            scale.pageAlignHorizontally = true;
        }

        bootState.state.start('Preloader');

    }
};

module.exports = Boot;