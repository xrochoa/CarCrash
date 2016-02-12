'use strict';

var utils = {

    //solution for circular dependencies = dependency injection
    fadeOut: function(sprite, seconds, dependency) {
        dependency.game.add.tween(sprite).to({
            alpha: 0
        }, seconds, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    fadeIn: function(sprite, seconds, dependency) {
        dependency.game.add.tween(sprite).to({
            alpha: 1
        }, seconds, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    tileAnimation: function(sprite, speed) {
        sprite.tilePosition.x -= speed;
    }

};

module.exports = utils; //ended up looking cleaner than a class