'use strict';

var state, game;

var Enemy = function(state, x, y, key, frame) {
    state = state;
    game = state.game;

    Phaser.Sprite.call(this, state, x, y, key, frame); //creates new sprite

    //initialize
    this.animations.add('explodeRed', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
    this.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype); //inherits properties and functions from Sprite object
Enemy.prototype.constructor = Enemy; //sets a reference to the class that will create new objects

Enemy.prototype.accelerate = function() {
    this.body.velocity.x = this.game.init.carPedal();
};

module.exports = Enemy;