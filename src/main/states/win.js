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
        this.title = this.add.tileSprite(15 * this.game.init.pixelScale, 15 * this.game.init.pixelScale, 30, 5, 'wintitle');
        this.scaleSprite(this.title);
        this.title.alpha = 0;

        //creates mini fridgebinge logo
        this.fblogo = this.add.tileSprite(this.game.init.gameWidth() - 70, this.game.init.gameHeight() - 32, 30, 11, 'fblogo');
        this.fblogo.scale.x = 2;
        this.fblogo.scale.y = 2;

        //creates car
        this.car = this.add.sprite(this.game.init.gameWidth() / 2, this.game.init.gameHeight() / 1.75, 'car');
        this.scaleSpriteByFour(this.car);
        this.car.anchor = { x: 0.5, y: 0.5 };

        this.frameIndex = 0;

        //fades title
        this.game.utils.fadeIn(this.title, 120, this);
        this.game.utils.bounceLoop(this.title, 200, 200, 0.75, 1, this.game);

        this.themeSong = this.add.audio('themeSong');
        this.explosion = this.add.audio('explosion');

        this.game.sound.setDecodedCallback(this.themeSong, this.startSong, this);

    },

    update: function() {

        this.car.angle += 1;

        this.frameIndex += 1;

        if (this.frameIndex === 2) {
            this.car.frame += 1;
            this.frameIndex = 0;
        }

    }

};

Win.prototype.scaleSprite = function(sprite) {
    sprite.scale.x = this.game.init.pixelScale;
    sprite.scale.y = this.game.init.pixelScale;
};

Win.prototype.scaleSpriteByFour = function(sprite) {
    sprite.scale.x = this.game.init.pixelScale * 4;
    sprite.scale.y = this.game.init.pixelScale * 4;
};

Win.prototype.startSong = function() {
    this.themeSong.loopFull(0.5);
    this.explosion.loopFull(0.5);
};
