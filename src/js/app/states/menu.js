'use strict';

var Menu = function() {};

//state and shortcuts
var menuState, game, add;

//sprites, audio and events
var menuBg, title, miniLogo, themeSong, enterKey;


Menu.prototype = {

    create: function() {

        //variables
        menuState = this;
        game = menuState.game;
        add = menuState.add;


        //creates menu background
        menuState.stage.backgroundColor = 0x323333;
        menuBg = add.tileSprite(0, 0, 30, 60, 'menuBg');
        menuState.scaleSprite(menuBg);
        menuBg.inputEnabled = true;

        //loads and starts song
        themeSong = add.audio('themeSong');
        menuState.sound.setDecodedCallback(themeSong, menuState.startSong, menuState);

        //creates car crash logo
        title = add.tileSprite(0, 15 * game.init.pixelScale, 30, 5, 'title');
        menuState.scaleSprite(title);
        title.alpha = 0;

        //creates mini fridgebinge logo
        miniLogo = add.tileSprite(game.init.gameWidth() - 70, game.init.gameHeight() - 32, 30, 11, 'fblogo');
        miniLogo.scale.x = 2;
        miniLogo.scale.y = 2;

        //creates listener for enter ley
        enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        //click or enter and start game
        menuBg.events.onInputDown.addOnce(menuState.startGame, menuState);
        enterKey.onDown.add(menuState.startGame, menuState);

    },

    update: function() {

        //fades title
        menuState.game.utils.fadeIn(title, 120, this);
    }

};

//CUSTOM METHODS

Menu.prototype.scaleSprite = function(sprite) {
    sprite.scale.x = this.game.init.pixelScale;
    sprite.scale.y = this.game.init.pixelScale;
};

Menu.prototype.startGame = function() {
    themeSong.stop();
    menuState.state.start('Game');
};

Menu.prototype.startSong = function() {
    themeSong.loopFull(0.5);
};

module.exports = Menu;