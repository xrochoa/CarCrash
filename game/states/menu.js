'use strict';

var init = require('../init.js');
var utils = require('../utils.js');


var Menu = function() {};

module.exports = Menu;


Menu.prototype = {

    create: function() {

        this.stage.backgroundColor = 0x323333;

        //level 1
        this.menu = this.add.tileSprite(0, 0, 30, 60, 'menu');
        this.scaleSprite(this.menu);
        this.menu.inputEnabled = true;
        this.menu.events.onInputDown.addOnce(this.startGame, this);

        this.title = this.add.tileSprite(0, 15 * init.pixelScale, 30, 5, 'title');
        this.scaleSprite(this.title);
        this.title.alpha = 0;

        this.fblogo = this.add.tileSprite(init.gameWidth() - 70, init.gameHeight() - 32, 30, 11, 'fblogo');
        this.fblogo.scale.x = 2;
        this.fblogo.scale.y = 2;
        this.title.alpha = 0;



        //fridgebinge stamp
        //this.fridgebinge = this.add.sprite(0, 0, 'fridgebinge');
        //this.scaleSprite(this.fridgebinge);




        //trucks...needed to make pixelTION WORK
        this.trucks = this.add.group();
        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * init.pixelScale, init.lanes[i], 'truck');
            //this.scaleSprite(this.truck);
        }



    },

    update: function() {
        utils.fadeIn(this.title, 120);
        utils.fadeIn(this.fblogo, 60);



    },

    render: function() {},


    scaleSprite: function(sprite) {
        sprite.scale.x = init.pixelScale;
        sprite.scale.y = init.pixelScale;
    },
    startGame: function() {
        this.state.start('Game');
    }
};