var Utils = {
    fadeOut: function(sprite, frames) {
        game.add.tween(sprite).to({
            alpha: 0
        }, frames, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    fadeIn: function(sprite, frames) {
        game.add.tween(sprite).to({
            alpha: 1
        }, frames, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
        tileAnimation: function(sprite, speed) {
        	sprite.tilePosition.x -= speed;
    },
};

module.exports = Utils;
