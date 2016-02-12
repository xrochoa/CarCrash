'use strict';

var Menu = function() {};

Menu.prototype = {

    create: function() {

        //creates menu background
        this.stage.backgroundColor = 0x323333;
        this.menu = this.add.tileSprite(0, 0, 30, 60, 'menu');
        this.scaleSprite(this.menu);
        this.menu.inputEnabled = true;

        //loads and starts song
        this.themesong = this.game.add.audio('themesong');
        this.sound.setDecodedCallback(this.themesong, this.startSong, this);

        //creates car crash logo
        this.title = this.add.tileSprite(0, 15 * this.game.init.pixelScale, 30, 5, 'title');
        this.scaleSprite(this.title);
        this.title.alpha = 0;

        //creates mini fridgebinge logo
        this.fblogo = this.add.tileSprite(this.game.init.gameWidth() - 70, this.game.init.gameHeight() - 32, 30, 11, 'fblogo');
        this.fblogo.scale.x = 2;
        this.fblogo.scale.y = 2;

        //creates listener for enter ley
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        //click or enter and start game
        this.menu.events.onInputDown.addOnce(this.startGame, this);
        this.enterKey.onDown.add(this.startGame, this);

    },

    update: function() {
        //fades title
        this.game.utils.fadeIn(this.title, 120, this);
    }

};

//CUSTOM METHODS

Menu.prototype.scaleSprite = function(sprite) {
    sprite.scale.x = this.game.init.pixelScale;
    sprite.scale.y = this.game.init.pixelScale;
};

Menu.prototype.startGame = function() {
    this.themesong.stop();
    this.state.start('Game');
};

Menu.prototype.startSong = function() {
    this.themesong.loopFull(0.5);
};

module.exports = Menu;