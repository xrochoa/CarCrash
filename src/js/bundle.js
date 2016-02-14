(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function() {

    //DEPENDENCIES

    //initial game values
    var init = require('./init.js');
    //utilities
    var utils = require('./utils.js');
    //states
    var boot = require('./states/boot.js'); //phaser configuration
    var preloader = require('./states/preloader.js'); //asset loading
    var menu = require('./states/menu.js'); //game menu
    var gameState = require('./states/game.js'); //game logic
    var win = require('./states/win.js'); //end of game


    //use Phaser or throw error
    var Phaser = window.Phaser ? window.Phaser : undefined;
    if (Phaser === undefined) {
        throw new Error('Phaser didn\'t load correctly. Please reload the website.');
    }

    //initialize game
    var game = new Phaser.Game(init.gameWidth(), init.gameHeight(), Phaser.CANVAS, 'gameDiv', null, false, false);

    //extending game with utilities
    game.utils = utils;
    //extending game with initial game values
    game.init = init;

    //game states
    game.state.add('Boot', boot);
    game.state.add('Preloader', preloader);
    game.state.add('Menu', menu);
    game.state.add('Game', gameState);
    game.state.add('Win', win);


    //launch boot state
    game.state.start('Boot');

})();
},{"./init.js":2,"./states/boot.js":3,"./states/game.js":4,"./states/menu.js":5,"./states/preloader.js":6,"./states/win.js":7,"./utils.js":8}],2:[function(require,module,exports){
'use strict';

module.exports = {

    pixelScale: 10,
    gameSpeed: 0.5,


    gameInit: false,
    gameOver: false,
    enemySpeed: 300,
    ajax: true,

    score: 0,
    levelIndex: 0,

    nextLevel: [10, 100, 1000],

    win: 10000,

    //network
    gameId: 'CarCrash',
    highscore: 0,
    level: 0,


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

},{}],3:[function(require,module,exports){
'use strict';

var Boot = function() {};

//'this' is the Boot state that also has a reference to game as a property this.game (very similar)
Boot.prototype = {

    preload: function() {

        var load = this.load;

        load.image('preloader', 'assets/preloader.png');
        load.image('fblogo', 'assets/fblogow.png');
    },

    create: function() {

        var game = this.game;
        var scale = this.scale;
        var bootState = this;

        bootState.input.maxPointers = 1;

        if (game.device.desktop) {
            scale.pageAlignHorizontally = true;
            scale.pageAlignVertically = true;
            scale.refresh();
        } else {
            scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            scale.minWidth = 480;
            scale.minHeight = 260;
            scale.maxWidth = 640;
            scale.maxHeight = 480;
            scale.forceLandscape = true;
            scale.pageAlignHorizontally = true;
        }

        bootState.state.start('Preloader');

    }
};

module.exports = Boot;
},{}],4:[function(require,module,exports){
'use strict';

var Game = function() {};
var cursors;

module.exports = Game;



Game.prototype = {

    create: function() {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //enable key up, down, etc
        cursors = this.game.input.keyboard.createCursorKeys();
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


        this.game.stage.backgroundColor = 0xff5040;

        //background
        this.bground = this.add.sprite(0, 0, 'bground');
        this.scaleSprite(this.bground);

        //level 1
        this.level = this.add.tileSprite(0, 0, 30, 60 * this.game.init.pixelScale, 'lv1');
        this.scaleSprite(this.level);

        //floor1
        this.floor = this.add.tileSprite(0, 45 * this.game.init.pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor);

        //road
        this.road = this.add.tileSprite(0, 34 * this.game.init.pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);

        //trucks
        this.trucks = this.add.group();
        this.trucks.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.trucks);
        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * this.game.init.pixelScale, this.game.init.lanes()[i], 'truck');
            this.scaleSprite(this.truck);
        }

        //player
        this.car = this.add.sprite(5 * this.game.init.pixelScale, 36 * this.game.init.pixelScale, 'car');
        this.car.animations.add('explode', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
        this.scaleSprite(this.car);
        this.physics.arcade.enable(this.car);

        //enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.enemies);
        for (var i = 0; i < 2; i++) {
            this.enemy = this.enemies.create(30 * this.game.init.pixelScale * (1 + i), this.game.init.lanes()[i], 'enemy');
            this.enemy.animations.add('explodeRed', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
            this.scaleSprite(this.enemy);

        }

        //score label
        this.bitmapTextFont = this.add.bitmapText(0, 5 * this.game.init.pixelScale, 'litto', 0, this.game.init.pixelScale);


        //gameover label
        this.over = this.add.sprite(5 * this.game.init.pixelScale, 15 * this.game.init.pixelScale, 'over');
        this.scaleSprite(this.over);
        this.over.alpha = 0;

        //retry button
        this.retry = this.add.button(9 * this.game.init.pixelScale, 35 * this.game.init.pixelScale, 'retry');
        this.scaleSprite(this.retry);
        this.retry.alpha = 0;

        //loads and starts song
        this.themesong = this.game.add.audio('themesong');
        this.sound.setDecodedCallback(this.themesong, this.startSong, this);


    },

    update: function() {
        //backckground movement
        this.game.utils.tileAnimation(this.level, this.game.init.gameSpeedSlowest());
        this.game.utils.tileAnimation(this.floor, this.game.init.gameSpeed);
        this.game.utils.tileAnimation(this.road, this.game.init.gameSpeedSlower());


        //first click game start
        if ((this.game.init.gameInit === false) && (cursors.down.isDown || cursors.up.isDown || this.game.input.activePointer.isDown)) {
            this.gameStart();
        }
        //when level changes
        if (this.game.init.nextLevel[this.game.init.levelIndex] === this.game.init.score) {
            //fadeOut animation
            this.bground.frame = this.game.init.levelIndex + 1;
            this.game.utils.fadeOut(this.level, 0, this);
            this.game.utils.fadeOut(this.floor, 0, this);
            this.game.init.levelIndex++;
            //fadeIn animation
            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeInNewLevel, this);
        }





        //game win
        if (this.game.init.score === this.game.init.win) {
            var gameAjaxData = {
                game: this.game.init.gameId,
                wins: 1
            };

            this.ajaxPut(gameAjaxData, '/api/stats');

            this.themesong.stop();
            this.game.state.start('Win');


        }

        //triggers game over
        if (this.game.init.gameOver === true && this.game.init.ajax === true) {
            this.themesong.stop();
            this.gameOver();
        };

        //car movement with click or mouse
        if ((cursors.up.isDown || (this.game.input.activePointer.isDown && this.game.input.activePointer.position.y < this.game.init.lanes()[2])) && ((this.car.y === this.game.init.lanes()[0]) || (this.car.y === this.game.init.lanes()[1]))) {
            this.carMoveUp();
        } else if (
            (cursors.down.isDown || (this.game.input.activePointer.isDown && this.game.input.activePointer.position.y > this.game.init.lanes()[2])) && ((this.car.y === this.game.init.lanes()[0]) || (this.car.y === this.game.init.lanes()[1]))) {
            this.carMoveDown();
        }
        var self = this;

        //enemy world bound recycle and score
        this.enemies.forEach(


            function(enemy) {
                if (enemy.x <= -5 * self.game.init.pixelScale && (self.game.init.gameOver === false)) {
                    enemy.y = self.game.init.lanes()[0] + (self.game.init.lanes()[1] - self.game.init.lanes()[0]) * self.game.rnd.integerInRange(0, 1);
                    enemy.x = 60 * self.game.init.pixelScale;
                    self.game.init.score++;
                }
            }
        );

        //temporary score label
        this.bitmapTextFont.text = this.game.init.score;
        this.bitmapTextFont.x = ((30 * this.game.init.pixelScale) - this.bitmapTextFont.width) / 2;

        //- this.bitmapTextFont.width(game.world.centerX )

        //truck collide action
        this.game.physics.arcade.overlap(this.car, this.trucks, this.truckExplode, null, this);

        //enemy collide action
        this.game.physics.arcade.overlap(this.car, this.enemies, this.carExplode, null, this);

        //enemy collide with truck
        this.game.physics.arcade.overlap(this.truck, this.enemies, this.enemyExplode, null, this);

    },

    render: function() {
        //console.log(init.fadeInLevel, this.game.init.levelIndex);
        //console.log(init.highscore);
    },

    carMoveUp: function() {
        this.carAccelerates(this.car);
        this.game.add.tween(this.car).to({
            y: this.game.init.lanes()[0]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    carMoveDown: function() {
        this.carAccelerates(this.car);
        this.game.add.tween(this.car).to({
            y: this.game.init.lanes()[1]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },

    //first and second objects are passed in order from overlap
    carExplode: function(car, enemy) {
        car.animations.play('explode');
        enemy.animations.play('explodeRed');
        this.game.init.gameOver = true;
    },

    truckExplode: function(car, truck) {
        this.carAccelerates(this.car);
        car.animations.play('explode');
        truck.body.velocity.x = this.game.init.enemySpeed;
        this.game.init.gameOver = true;

    },

    enemyExplode: function(truck, enemy) {
        //only destroys if truck is moving
        if (truck.body.velocity.x === this.game.init.enemySpeed) {
            enemy.animations.play('explodeRed');
            this.carAccelerates(enemy);
        }
    },

    scaleSprite: function(sprite) {
        sprite.scale.x = this.game.init.pixelScale;
        sprite.scale.y = this.game.init.pixelScale;
    },

    gameStart: function() {
        this.car.body.gravity.x = this.game.init.gravity();
        //speed for all in group
        this.enemies.setAll('body.velocity.x', -this.game.init.enemySpeed);
        this.game.init.gameInit = true;

    },

    gameOver: function() {
        //add highest score
        if (this.game.init.score > this.game.init.highscore) {
            this.game.init.highscore = this.game.init.score;
        }

        var gameAjaxData = {
            game: this.game.init.gameId,
            highscore: this.game.init.highscore,
            level: this.game.init.level
        };

        this.ajaxPut(gameAjaxData, '/api/stats');
        this.ajaxGet('/api/highscores');

        this.game.utils.fadeOut(this.bground, 0, this);
        this.game.utils.fadeOut(this.level, 0, this);
        this.game.utils.fadeOut(this.floor, 0, this);
        this.game.utils.fadeIn(this.over, 0, this);
        this.game.utils.fadeIn(this.retry, 0, this);
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.retryEnableInput, this);


    },
    retryEnableInput: function() {
        this.retry.events.onInputDown.addOnce(this.gameReload, this);
        this.enterKey.onDown.add(this.gameReload, this);



    },

    gameReload: function() {

        var gameAjaxData = {
            game: this.game.init.gameId,
            plays: 1
        };

        this.ajaxPut(gameAjaxData, '/api/stats');


        this.game.init.gameInit = false;
        this.game.init.gameOver = false;
        this.game.init.score = 0;
        this.game.init.levelIndex = 0;

        this.game.init.ajax = true; //activates gameover only once

        this.state.restart(true, false);


    },

    carAccelerates: function(sprite) {
        sprite.body.velocity.x = this.game.init.carPedal();
    },

    ajaxPut: function(data, url) {

        var request = new XMLHttpRequest();
        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify(data));

        //console.log(data);

        this.game.init.ajax = false;

    },

    ajaxGet: function(url) {

        //loads highscores to compare them with my score

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        var _this = this; //to be able to call this from inside function

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = JSON.parse(request.responseText);
                for (var i = 0; i < resp.length; i++) {
                    _this.checkHighscore(resp[i].highscore.score);
                }

            } else {
                console.log('We reached our target server, but it returned an error.');

            }
        };

        request.onerror = function() {
            console.log('There was a connection error of some sort.');
        };

        request.send();

    },
    fadeInNewLevel: function() {
        if (this.game.init.gameOver === false) {
            var levelString = 'lv' + (this.game.init.levelIndex + 1);
            var floorString = 'floor' + (this.game.init.levelIndex + 1);

            this.level.loadTexture(levelString);
            this.floor.loadTexture(floorString);

            this.game.utils.fadeIn(this.level, 0, this);
            this.game.utils.fadeIn(this.floor, 0, this);
        }
    },
    checkHighscore: function(score) {

        //checks highscores and compares them with my score

        if (this.game.init.score > score) {
            console.log('new record!');
        }

    }

};

Game.prototype.startSong = function() {
    this.themesong.loopFull(0.5);
};
},{}],5:[function(require,module,exports){
'use strict';

var Menu = function() {};

//state
var menuState;

//sprites, audio and events
var menuBg, title, miniLogo, themeSong, enterKey;


Menu.prototype = {

    create: function() {

        menuState = this;
        var add = menuState.add;
        var game = menuState.game;

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
},{}],6:[function(require,module,exports){
'use strict';

var Preloader = function() {};

Preloader.prototype = {

    preload: function() {

        var preloaderState = this;
        var load = preloaderState.load;

        //set background logo and progress bar
        preloaderState.setProgressLogo();

        //LOAD GAME ASSETS
        //menu
        load.image('menuBg', 'assets/menu.png');
        load.image('title', 'assets/title.png');
        //color backgrounds
        load.spritesheet('bground', 'assets/backgrounds.png', 30, 60, 4); // size 30x60 and 4 frames
        //level backgrounds
        load.image('lv1', 'assets/lv1.png');
        load.image('lv2', 'assets/lv2.png');
        load.image('lv3', 'assets/lv3.png');
        load.image('lv4', 'assets/lv4.png');
        //road
        load.image('road', 'assets/road.png');
        //floor backgrounds
        load.image('floor1', 'assets/floor1.png');
        load.image('floor2', 'assets/floor2.png');
        load.image('floor3', 'assets/floor3.png');
        load.image('floor4', 'assets/floor4.png');
        //sprites
        load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        load.image('truck', 'assets/truck.png');
        load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        load.image('over', 'assets/over.png');
        load.image('retry', 'assets/retry.png');
        //sounds
        load.audio('themeSong', 'assets/themesong.m4a');
        //winner
        load.image('winback', 'assets/winback.png');
        load.image('wintitle', 'assets/wintitle.png');

        //COMPLETED LISTENER: call method on load completed
        load.onLoadComplete.add(preloaderState.onLoadComplete, preloaderState);

    }

};

//CUSTOM METHODS (for modularity)
Preloader.prototype.setProgressLogo = function() {
    
    var game = this.game;
    var load = this.load;
    var add = this.add;

    //place logo and asset
    var progressBar = add.sprite((game.init.gameWidth() / 2) - 110, (game.init.gameHeight() / 2), 'preloader');
    progressBar.cropEnabled = false;

    var fridgeBingeLogo = add.tileSprite((game.init.gameWidth() / 2) - 90, (game.init.gameHeight() / 2) - 90, 30, 11, 'fblogo');
    fridgeBingeLogo.scale.x = 6;
    fridgeBingeLogo.scale.y = 6;

    //loads progress bar
    load.setPreloadSprite(progressBar);

};

Preloader.prototype.onLoadComplete = function() {
    var preloaderState = this;
    preloaderState.state.start('Menu');
};

module.exports = Preloader;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}]},{},[1])