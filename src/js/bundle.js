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

//state and shortcuts
var bootState, game, load, scale;

var Boot = function() {};

//'this' is the Boot state that also has a reference to game as a property this.game (very similar)
Boot.prototype = {

    preload: function() {
        //variables
        bootState = this;
        load = bootState.load;

        load.image('preloader', 'assets/preloader.png');
        load.image('fblogo', 'assets/fblogow.png');
    },

    create: function() {
        //variables
        game = bootState.game;
        scale = bootState.scale;

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

//state and shortcuts
var gameState, keyboard, game, add, physics;

//sprites, audio and events
var cursors, enterKey, background, level, floor, road, truckGroup,
    truck, player, enemyGroup, enemy, scoreLabel, gameOverLabel,
    retryButton, themeSong;

//ajax
var winData, looseData, reloadData;

var Game = function() {};

Game.prototype = {

    create: function() {

        //variables
        gameState = this;
        keyboard = gameState.input.keyboard;
        game = gameState.game;
        add = gameState.add;
        physics = gameState.physics;


        console.log(this);

        //enable the Arcade Physics system
        physics.startSystem(Phaser.Physics.ARCADE);

        //enable key up, down, etc
        cursors = keyboard.createCursorKeys();
        enterKey = keyboard.addKey(Phaser.Keyboard.ENTER);

        game.stage.backgroundColor = 0xff5040;

        //background
        background = add.sprite(0, 0, 'bground');
        gameState.scaleSprite(background);

        //level 1
        level = add.tileSprite(0, 0, 30, 60 * game.init.pixelScale, 'lv1');
        gameState.scaleSprite(level);

        //floor1
        floor = add.tileSprite(0, 45 * game.init.pixelScale, 30, 15, 'floor1');
        gameState.scaleSprite(floor);

        //road
        road = add.tileSprite(0, 34 * game.init.pixelScale, 30, 13, 'road');
        gameState.scaleSprite(road);

        //trucks
        truckGroup = add.group();
        truckGroup.enableBody = true;

        //adds physics to each member
        physics.arcade.enable(truckGroup);
        for (var i = 0; i < 2; i++) {
            truck = truckGroup.create(-9 * game.init.pixelScale, game.init.lanes()[i], 'truck');
            gameState.scaleSprite(truck);
        }

        //player = blue car
        player = add.sprite(5 * game.init.pixelScale, 36 * game.init.pixelScale, 'car');
        player.animations.add('explode', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
        gameState.scaleSprite(player);
        physics.arcade.enable(player);

        //enemy = red cars
        enemyGroup = add.group();
        enemyGroup.enableBody = true;

        //adds physics to each member
        physics.arcade.enable(enemyGroup);
        for (var i = 0; i < 2; i++) {
            enemy = enemyGroup.create(30 * game.init.pixelScale * (1 + i), game.init.lanes()[i], 'enemy');
            enemy.animations.add('explodeRed', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
            gameState.scaleSprite(enemy);

        }

        //score label
        scoreLabel = add.bitmapText(0, 5 * game.init.pixelScale, 'litto', 0, game.init.pixelScale);


        //gameover label
        gameOverLabel = add.sprite(5 * game.init.pixelScale, 15 * game.init.pixelScale, 'over');
        gameState.scaleSprite(gameOverLabel);
        gameOverLabel.alpha = 0;

        //retry button
        retryButton = add.button(9 * game.init.pixelScale, 35 * game.init.pixelScale, 'retry');
        gameState.scaleSprite(retryButton);
        retryButton.alpha = 0;

        //loads and starts song
        themeSong = add.audio('themeSong');
        gameState.sound.setDecodedCallback(themeSong, gameState.startSong, gameState);


    },

    update: function() {
        //backckground movement
        game.utils.tileAnimation(level, game.init.gameSpeedSlowest());
        game.utils.tileAnimation(floor, game.init.gameSpeed);
        game.utils.tileAnimation(road, game.init.gameSpeedSlower());


        //first click game start
        if ((game.init.gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            gameState.gameStart();
        }

        //when level changes
        if (game.init.nextLevel[game.init.levelIndex] === game.init.score) {
            //fadeOut animation
            background.frame = game.init.levelIndex + 1;
            game.utils.fadeOut(level, 0, gameState);
            game.utils.fadeOut(floor, 0, gameState);
            game.init.levelIndex++;
            //fadeIn animation
            game.time.events.add(Phaser.Timer.SECOND * 1, gameState.fadeInNewLevel, gameState);
        }

        //game win
        if (game.init.score === game.init.win) {
            winData = {
                game: game.init.gameId,
                wins: 1
            };

            gameState.ajaxPut(winData, '/api/stats');

            themeSong.stop();
            gameState.state.start('Win');

        }

        //triggers game over
        if (game.init.gameOver === true && game.init.ajax === true) {
            themeSong.stop();
            gameState.gameOver();
        };

        //car movement with click or mouse
        if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < game.init.lanes()[2])) && ((player.y === game.init.lanes()[0]) || (player.y === game.init.lanes()[1]))) {
            gameState.carMoveUp();
        } else if (
            (cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > game.init.lanes()[2])) && ((player.y === game.init.lanes()[0]) || (player.y === game.init.lanes()[1]))) {
            gameState.carMoveDown();
        }

        //enemy world bound recycle and score
        enemyGroup.forEach(


            function(enemy) {
                if (enemy.x <= -5 * game.init.pixelScale && (game.init.gameOver === false)) {
                    enemy.y = game.init.lanes()[0] + (game.init.lanes()[1] - game.init.lanes()[0]) * game.rnd.integerInRange(0, 1);
                    enemy.x = 60 * game.init.pixelScale;
                    game.init.score++;
                }
            }
        );

        //temporary score label
        scoreLabel.text = game.init.score;
        scoreLabel.x = ((30 * game.init.pixelScale) - scoreLabel.width) / 2;


        //truck collide action
        physics.arcade.overlap(player, truckGroup, gameState.truckExplode, null, gameState);

        //enemy collide action
        physics.arcade.overlap(player, enemyGroup, gameState.carExplode, null, gameState);

        //enemy collide with truck
        physics.arcade.overlap(truck, enemyGroup, gameState.enemyExplode, null, gameState);

    },

    render: function() {
        //console.log(init.fadeInLevel, this.game.init.levelIndex);
        //console.log(init.highscore);
    },

    carMoveUp: function() {
        gameState.carAccelerates(player);
        add.tween(player).to({
            y: game.init.lanes()[0]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    carMoveDown: function() {
        gameState.carAccelerates(player);
        add.tween(player).to({
            y: game.init.lanes()[1]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },

    //first and second objects are passed in order from overlap
    carExplode: function(player, enemy) {
        player.animations.play('explode');
        enemy.animations.play('explodeRed');
        game.init.gameOver = true;
    },

    truckExplode: function(player, truck) {
        gameState.carAccelerates(player);
        player.animations.play('explode');
        truck.body.velocity.x = game.init.enemySpeed;
        game.init.gameOver = true;

    },

    enemyExplode: function(truck, enemy) {
        //only destroys if truck is moving
        if (truck.body.velocity.x === game.init.enemySpeed) {
            enemy.animations.play('explodeRed');
            gameState.carAccelerates(enemy);
        }
    },

    scaleSprite: function(sprite) {
        sprite.scale.x = this.game.init.pixelScale;
        sprite.scale.y = this.game.init.pixelScale;
    },

    gameStart: function() {
        player.body.gravity.x = game.init.gravity();
        //speed for all in group
        enemyGroup.setAll('body.velocity.x', -game.init.enemySpeed);
        game.init.gameInit = true;

    },

    gameOver: function() {
        //add highest score
        if (game.init.score > game.init.highscore) {
            game.init.highscore = game.init.score;
        }

        var looseData = {
            game: game.init.gameId,
            highscore: game.init.highscore,
            level: game.init.level
        };

        gameState.ajaxPut(looseData, '/api/stats');
        gameState.ajaxGet('/api/highscores');

        game.utils.fadeOut(background, 0, gameState);
        game.utils.fadeOut(level, 0, gameState);
        game.utils.fadeOut(floor, 0, gameState);
        game.utils.fadeIn(gameOverLabel, 0, gameState);
        game.utils.fadeIn(retryButton, 0, gameState);
        game.time.events.add(Phaser.Timer.SECOND * 0.5, gameState.retryEnableInput, gameState);


    },
    retryEnableInput: function() {
        retryButton.events.onInputDown.addOnce(gameState.gameReload, gameState);
        enterKey.onDown.add(gameState.gameReload, gameState);
    },

    gameReload: function() {

        var reloadData = {
            game: game.init.gameId,
            plays: 1
        };

        gameState.ajaxPut(reloadData, '/api/stats');


        game.init.gameInit = false;
        game.init.gameOver = false;
        game.init.score = 0;
        game.init.levelIndex = 0;

        game.init.ajax = true; //activates gameover only once

        gameState.state.restart(true, false);


    },

    carAccelerates: function(sprite) {
        sprite.body.velocity.x = game.init.carPedal();
    },

    ajaxPut: function(data, url) {

        var request = new XMLHttpRequest();
        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify(data));

        //console.log(data);

        game.init.ajax = false;

    },

    ajaxGet: function(url) {

        //loads highscores to compare them with my score

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = JSON.parse(request.responseText);
                for (var i = 0; i < resp.length; i++) {
                    gameState.checkHighscore(resp[i].highscore.score);
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
        if (game.init.gameOver === false) {

            level.loadTexture('lv' + (game.init.levelIndex + 1));
            floor.loadTexture('floor' + (game.init.levelIndex + 1));

            game.utils.fadeIn(level, 0, gameState);
            game.utils.fadeIn(floor, 0, gameState);
        }
    },
    checkHighscore: function(score) {

        //checks highscores and compares them with my score

        if (game.init.score > score) {
            console.log('new record!');
        }

    }

};

Game.prototype.startSong = function() {
    themeSong.loopFull(0.5);
};

module.exports = Game;
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
'use strict';

//state and shortcuts
var preloaderState, game, load, add;

//sprites, audio and events
var fridgeBingeLogo, progressBar;

var Preloader = function() {};

Preloader.prototype = {

    preload: function() {

        //variables
        preloaderState = this;
        load = preloaderState.load;

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
    
    //variables
    game = preloaderState.game;
    add = preloaderState.add;

    //place logo and progress bar
    fridgeBingeLogo = add.tileSprite((game.init.gameWidth() / 2) - 90, (game.init.gameHeight() / 2) - 90, 30, 11, 'fblogo');
    fridgeBingeLogo.scale.x = 6;
    fridgeBingeLogo.scale.y = 6;

    progressBar = add.sprite((game.init.gameWidth() / 2) - 110, (game.init.gameHeight() / 2), 'preloader');
    progressBar.cropEnabled = false;

    //loads progress bar
    load.setPreloadSprite(progressBar);

};

Preloader.prototype.onLoadComplete = function() {
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