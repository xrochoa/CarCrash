'use strict';

var Win = function() {};

Win.prototype = {

    create: function() {

        //creates menu background
        this.stage.backgroundColor = 0x323333;
        this.menu = this.add.tileSprite(0, 0, 30, 60, 'winback');
        this.scaleSprite(this.menu);
        this.menu.inputEnabled = true;

        //creates car crash logo
        this.title = this.add.tileSprite(0, 15 * this.game.init.pixelScale, 30, 5, 'wintitle');
        this.scaleSprite(this.title);
        this.title.alpha = 0;

        //creates mini fridgebinge logo
        this.fblogo = this.add.tileSprite(this.game.init.gameWidth() - 70, this.game.init.gameHeight() - 32, 30, 11, 'fblogo');
        this.fblogo.scale.x = 2;
        this.fblogo.scale.y = 2;

    },

    update: function() {
        //fades title
        this.game.utils.fadeIn(this.title, 120, this);
    }

};

Win.prototype.scaleSprite = function(sprite) {
    sprite.scale.x = this.game.init.pixelScale;
    sprite.scale.y = this.game.init.pixelScale;
};

module.exports = Win;