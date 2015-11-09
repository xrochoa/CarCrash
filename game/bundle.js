(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {

    pixelScale: 10,
    gameSpeed: 0.5,


    gameInit: false,
    gameOver: false,
    enemySpeed: 300,

    score: 0,
    nextLevel: [10,100,1000],
    fadeInLevel: 11,
    levelColor: [0xffe359, 0xfe9040, 0x70efff],
    levelIndex: 0,
    win: 10000,

    //depend on gameSpeed
    gameSpeedSlower: function() {
        return this.gameSpeed / 2;
    },
    gameSpeedSlowest: function() {
        return this.gameSpeed / 10;
    },


    //depend on pixelscale
    lanes: function() {
        var lane1 = 36 * this.pixelScale;
        var lane2 = 42 * this.pixelScale;
        var middleLane = 40.5 * this.pixelScale;
        return [lane1, lane2, middleLane];
    },
    gravity: function() {
        return -35 * this.pixelScale;
    },
    carPedal: function() {
        return 10 * this.pixelScale;
    },
    gameWidth: function() {
        return 30 * this.pixelScale;
    },
    gameHeight: function() {
        return 60 * this.pixelScale;
    }


};

//enemies;
/*


*/
},{}],2:[function(require,module,exports){
'use strict';

var init = require('./init.js');

window.game = new Phaser.Game(init.gameWidth(), init.gameHeight(), Phaser.CANVAS, 'gameDiv', null, false, false);

game.state.add('Boot', require('./states/boot.js'));
game.state.add('Preloader', require('./states/preloader.js'));

game.state.add('Menu', require('./states/menu.js'));
game.state.add('Game', require('./states/game.js'));
//start
game.state.start('Boot');


/*
var gameSpeed = 0.5,
    gameSpeedSlower = gameSpeed / 2,
    gameSpeedSlowest = gameSpeed / 25;

var gameOver = false;

//lane1, lane 2 and middle lane
var lanes = [36 * pixelScale, 42 * pixelScale, 40.5 * pixelScale];

var gameInit = false;
var gravity = -35 * pixelScale;
var carPedal = 10 * pixelScale;

var enemies;
var enemySpeed = 300;

var gameWidth = 30 * pixelScale;
var gameHeight = 60 * pixelScale;

var score = 0;*/
},{"./init.js":1,"./states/boot.js":3,"./states/game.js":4,"./states/menu.js":5,"./states/preloader.js":6}],3:[function(require,module,exports){
var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

  preload: function () {
    this.load.image('preloader', 'assets/preloader.gif');
  },

  create: function () {
    this.game.input.maxPointers = 1;

    if (this.game.device.desktop) {
      this.game.stage.scale.pageAlignHorizontally = true;
    } else {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth =  480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 640;
      this.game.scale.maxHeight = 480;
      this.game.scale.forceLandscape = true;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.setScreenSize(true);
    }

    this.game.state.start('Preloader');
  }
};

},{}],4:[function(require,module,exports){
var init = require('../init.js');
var utils = require('../utils.js');

var Game = function() {};
var cursors;

module.exports = Game;



Game.prototype = {

    create: function() {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //enable key up, down, etc
        cursors = game.input.keyboard.createCursorKeys();

        //level 1
        this.level = this.add.tileSprite(0, 0, 30, 60 * init.pixelScale, 'lv1');
        this.scaleSprite(this.level);



        //floor1
        this.floor = this.add.tileSprite(0, 45 * init.pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor);

        //road
        this.road = this.add.tileSprite(0, 34 * init.pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);

        //trucks
        this.trucks = this.add.group();
        this.trucks.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.trucks);
        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * init.pixelScale, init.lanes()[i], 'truck');
            this.scaleSprite(this.truck);
        }

        //player
        this.car = this.add.sprite(5 * init.pixelScale, 36 * init.pixelScale, 'car');
        this.car.animations.add('explode', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
        this.scaleSprite(this.car);
        this.physics.arcade.enable(this.car);

        //enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.enemies);
        for (var i = 0; i < 2; i++) {
            this.enemy = this.enemies.create(30 * init.pixelScale * (1 + i), init.lanes()[i], 'enemy');
            this.enemy.animations.add('explodeRed', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
            this.scaleSprite(this.enemy);

        }

        //score label
        this.bitmapTextFont = this.add.bitmapText(0, 5 * init.pixelScale, 'litto', 0, init.pixelScale);


        //gameover label
        this.over = this.add.sprite(5 * init.pixelScale, 15 * init.pixelScale, 'over');
        this.scaleSprite(this.over);
        this.over.alpha = 0;

        //retry button
        this.retry = this.add.button(9 * init.pixelScale, 35 * init.pixelScale, 'retry');
        this.scaleSprite(this.retry);
        this.retry.alpha = 0;


    },

    update: function() {
        //backckground movement
        utils.tileAnimation(this.level, init.gameSpeedSlowest());
        utils.tileAnimation(this.floor, init.gameSpeed);
        utils.tileAnimation(this.road, init.gameSpeedSlower());


        //first click game start
        if ((init.gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            this.gameStart();
        }
        //when level changes
        if (init.nextLevel[init.levelIndex] === init.score) {
            game.stage.backgroundColor = init.levelColor[init.levelIndex];
            utils.fadeOut(this.level);
            utils.fadeOut(this.floor);
            init.levelIndex++;

        }
        //animation of level fadein

        if (init.fadeInLevel === init.score) {
            var levelString = 'lv' + (init.levelIndex + 1);
            var floorString = 'floor' + (init.levelIndex + 1);

            this.level.loadTexture(levelString);
            this.floor.loadTexture(floorString);

            utils.fadeIn(this.level);
            utils.fadeIn(this.floor);
            init.fadeInLevel = init.nextLevel[init.levelIndex] + 1; //NaN in the last one but thats ok

        }
        //game win
        if (init.score === init.win) {
            this.game.state.start('Win');
        }

        //triggers game over
        if (init.gameOver === true) {
            this.gameOver();
        };

        //car movement with click or mouse
        if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < init.lanes()[2])) && ((this.car.y === init.lanes()[0]) || (this.car.y === init.lanes()[1]))) {
            this.carMoveUp();
        } else if (
            (cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > init.lanes()[2])) && ((this.car.y === init.lanes()[0]) || (this.car.y === init.lanes()[1]))) {
            this.carMoveDown();
        }

        //enemy world bound recycle and score
        this.enemies.forEach(
            function(enemy) {
                if (enemy.x <= -5 * init.pixelScale && (init.gameOver === false)) {
                    enemy.y = init.lanes()[0] + (init.lanes()[1] - init.lanes()[0]) * game.rnd.integerInRange(0, 1);
                    enemy.x = 60 * init.pixelScale;
                    init.score++;
                }
            }
        );

        //temporary score label
        this.bitmapTextFont.text = init.score;
        this.bitmapTextFont.x = ((30 * init.pixelScale) - this.bitmapTextFont.width) / 2;

        //- this.bitmapTextFont.width(game.world.centerX )

        //truck collide action
        game.physics.arcade.overlap(this.car, this.trucks, this.truckExplode, null, this);

        //enemy collide action
        game.physics.arcade.overlap(this.car, this.enemies, this.carExplode, null, this);

        //enemy collide with truck
        game.physics.arcade.overlap(this.truck, this.enemies, this.enemyExplode, null, this);

    },

    render: function() {
        //console.log(init.fadeInLevel, init.levelIndex);
    },

    carMoveUp: function() {
        this.carAccelerates(this.car);
        game.add.tween(this.car).to({
            y: init.lanes()[0]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    carMoveDown: function() {
        this.carAccelerates(this.car);
        game.add.tween(this.car).to({
            y: init.lanes()[1]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },

    //first and second objects are passed in order from overlap
    carExplode: function(car, enemy) {
        car.animations.play('explode');
        enemy.animations.play('explodeRed');
        init.gameOver = true;
    },

    truckExplode: function(car, truck) {
        this.carAccelerates(this.car);
        car.animations.play('explode');
        truck.body.velocity.x = init.enemySpeed;
        init.gameOver = true;

    },

    enemyExplode: function(truck, enemy) {
        //only destroys if truck is moving
        if (truck.body.velocity.x === init.enemySpeed) {
            enemy.animations.play('explodeRed');
            this.carAccelerates(enemy);
        }
    },

    scaleSprite: function(sprite) {
        sprite.scale.x = init.pixelScale;
        sprite.scale.y = init.pixelScale;
    },

    gameStart: function() {
        this.car.body.gravity.x = init.gravity();
        //speed for all in group
        this.enemies.setAll('body.velocity.x', -init.enemySpeed);
        init.gameInit = true;

    },

    gameOver: function() {
        game.stage.backgroundColor = 0xff5040;
        utils.fadeOut(this.level, 60);
        utils.fadeOut(this.floor, 60);
        utils.fadeIn(this.over, 60);
        utils.fadeIn(this.retry, 60);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, this.retryEnableInput, this);


    },
    retryEnableInput: function() {
        this.retry.events.onInputDown.addOnce(this.gameReload, this);
    },

    gameReload: function() {
        init.gameInit = false;
        init.gameOver = false;
        init.score = 0;
        init.levelIndex = 0;
        init.fadeInLevel = 11;

        this.state.restart(true, false);


    },

    carAccelerates: function(sprite) {
        sprite.body.velocity.x = init.carPedal();
    }
};
},{"../init.js":1,"../utils.js":7}],5:[function(require,module,exports){
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
},{"../init.js":1,"../utils.js":7}],6:[function(require,module,exports){
var Preloader = function(game) {
    this.asset = null;
    this.ready = false;
};



module.exports = Preloader;



Preloader.prototype = {

    preload: function() {
        this.asset = this.add.sprite(320, 240, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);

        this.load.image('menu', 'assets/menu.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('fblogo', 'assets/fblogow.png');


        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('lv2', 'assets/lv2.png');
        this.load.image('lv3', 'assets/lv3.png');
        this.load.image('lv4', 'assets/lv4.png');

        this.load.image('road', 'assets/road.png');

        this.load.image('floor1', 'assets/floor1.png');
        this.load.image('floor2', 'assets/floor2.png');
        this.load.image('floor3', 'assets/floor3.png');
        this.load.image('floor4', 'assets/floor4.png');

        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        this.load.image('truck', 'assets/truck.png');
        this.load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        this.load.image('over', 'assets/over.png');
        this.load.image('retry', 'assets/retry.png');
    },

    create: function() {
        this.asset.cropEnabled = false;
    },

    update: function() {
        if (!!this.ready) {
            this.game.state.start('Menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};
},{}],7:[function(require,module,exports){
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

},{}]},{},[2]);
