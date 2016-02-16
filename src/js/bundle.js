(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var state, game, add, physics;

var Player = function(state, x, y, frame, key) {
    state = state;
    game = state.game;
    add = state.add;
    physics = state.physics;

    Phaser.Sprite.call(this, game, x, y, frame, key); //creates new sprite
    add.existing(this); //adds sprite to state

    //initialize
    this.animations.add('explode', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
    physics.arcade.enable(this);
    this.scale.x = game.init.pixelScale;
    this.scale.y = game.init.pixelScale;
};

Player.prototype = Object.create(Phaser.Sprite.prototype); //inherits properties and functions from Sprite object
Player.prototype.constructor = Player; //sets a reference to the class that will create new objects

Player.prototype.moveUp = function() {
    this.accelerate();
    add.tween(this).to({
        y: game.init.lanes()[0]
    }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
};

Player.prototype.moveDown = function() {
    this.accelerate();
    add.tween(this).to({
        y: game.init.lanes()[1]
    }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
};

Player.prototype.accelerate = function() {
    this.body.velocity.x = game.init.carPedal();
};

module.exports = Player;
},{}],2:[function(require,module,exports){
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
},{"./init.js":3,"./states/boot.js":4,"./states/game.js":5,"./states/menu.js":6,"./states/preloader.js":7,"./states/win.js":8,"./utils.js":9}],3:[function(require,module,exports){
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

    nextLevel: [1, 3, 5],

    win: 9,

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

},{}],4:[function(require,module,exports){
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
            scale.minWidth = window.innerHeight / 1.5;
            scale.minHeight = window.innerHeight;
            scale.maxWidth = window.innerHeight / 1.5;
            scale.maxHeight = window.innerHeight;
            scale.forceLandscape = true;
            scale.pageAlignHorizontally = true;
        }

        bootState.state.start('Preloader');

    }
};

module.exports = Boot;
},{}],5:[function(require,module,exports){
'use strict';

//state and shortcuts
var gameState, keyboard, game, add, physics;

//sprites, audio and events
var cursors, enterKey, background, level, floor, road, truckGroup,
    truck, player, enemyGroup, enemy, scoreLabel, gameOverLabel,
    retryButton, themeSong;

//external dependencies
var Player = require('../entities/player.js');

var Game = function() {};

Game.prototype = {

    create: function() {

        //variables
        gameState = this;
        keyboard = gameState.input.keyboard;
        game = gameState.game;
        add = gameState.add;
        physics = gameState.physics;

        //enable the Arcade Physics system
        physics.startSystem(Phaser.Physics.ARCADE);

        //enable key up, down, etc
        cursors = keyboard.createCursorKeys();
        enterKey = keyboard.addKey(Phaser.Keyboard.ENTER);

        //color background
        game.stage.backgroundColor = 0xff5040;

        //background
        background = add.sprite(0, 0, 'bground');
        background.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);

        //level 1
        level = add.tileSprite(0, 0, 30, 60 * game.init.pixelScale, 'lv1');
        level.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);

        //floor1
        floor = add.tileSprite(0, 45 * game.init.pixelScale, 30, 15, 'floor1');
        floor.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);

        //road
        road = add.tileSprite(0, 34 * game.init.pixelScale, 30, 13, 'road');
        road.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);

        //trucks
        truckGroup = add.group();
        truckGroup.enableBody = true;
        physics.arcade.enable(truckGroup);
        for (var i = 0; i < 2; i++) {
            truck = truckGroup.create(-9 * game.init.pixelScale, game.init.lanes()[i], 'truck');
            truck.scale.setTo(game.init.pixelScale, game.init.pixelScale);
        }

        //enemy = red cars
        enemyGroup = add.group();
        enemyGroup.enableBody = true;
        physics.arcade.enable(enemyGroup);
        for (var i = 0; i < 2; i++) {
            enemy = enemyGroup.create(30 * game.init.pixelScale * (1 + i), game.init.lanes()[i], 'enemy');
            enemy.scale.setTo(game.init.pixelScale, game.init.pixelScale);
            enemy.animations.add('explodeRed', [1, 2, 3, 4, 5, 6], 10, false).killOnComplete = true;
        }

        //player = blue car
        player = new Player(gameState, 5 * game.init.pixelScale, 36 * game.init.pixelScale, 'car');

        //score label
        scoreLabel = add.bitmapText(0, 5 * game.init.pixelScale, 'litto', 0, game.init.pixelScale);

        //gameover label
        gameOverLabel = add.sprite(5 * game.init.pixelScale, 15 * game.init.pixelScale, 'over');
        gameOverLabel.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);
        gameOverLabel.alpha = 0;

        //retry button
        retryButton = add.button(9 * game.init.pixelScale, 35 * game.init.pixelScale, 'retry');
        retryButton.scale.setTo(this.game.init.pixelScale, this.game.init.pixelScale);
        retryButton.alpha = 0;

        //song
        themeSong = add.audio('themeSong');
        gameState.sound.setDecodedCallback(themeSong, gameState.startSong, gameState);

    },

    update: function() {

        //animate background
        gameState.animateBackground();


        //first click/enter starts game
        if ((game.init.gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            gameState.gameStart();
        }

        //next level
        if (game.init.nextLevel[game.init.levelIndex] === game.init.score) {
            gameState.newLevelStart();
        }

        //game over
        if (game.init.gameOver === true && game.init.ajax === true) {
            gameState.gameOver();
        };

        //game win
        if (game.init.score === game.init.win) {
            gameState.gameWin();
        }

        //PLAYER EVENTS
        //car movement with click or mouse
        if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < game.init.lanes()[2])) && ((player.y === game.init.lanes()[0]) || (player.y === game.init.lanes()[1]))) {
            player.moveUp();
        } else if (
            (cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > game.init.lanes()[2])) && ((player.y === game.init.lanes()[0]) || (player.y === game.init.lanes()[1]))) {
            player.moveDown();
        }

        //ENEMY RECYCLE -> INCREASE SCORE -> UPDATE SCORE LABEL
        gameState.enemyScoreUpdate();

        //COLLISIONS
        //playerEnemyCollisionssssssssssssssssssssssssssssssss
        physics.arcade.overlap(player, enemyGroup, gameState.playerEnemyCollision);
        //playerTruckCollision
        physics.arcade.overlap(player, truckGroup, gameState.playerTruckCollision);
        //enemyTruckCollision
        physics.arcade.overlap(truckGroup, enemyGroup, gameState.enemyTruckCollision);

    },

    render: function() {
        //console.log(init.fadeInLevel, this.game.init.levelIndex);
        //console.log(init.highscore);
    }

};

//CUSTOM METHODS

//GAME START - GAME OVER - RETRY

Game.prototype.gameStart = function() {
    //player and enemy move
    player.body.gravity.x = game.init.gravity();
    enemyGroup.setAll('body.velocity.x', -game.init.enemySpeed); //speed for all in group
    //game start
    game.init.gameInit = true;

};

Game.prototype.gameOver = function() {
    //save highest score in init data
    if (game.init.score > game.init.highscore) {
        game.init.highscore = game.init.score;
    }

    //ajax loose
    game.utils.ajax.loose(game);
    game.init.ajax = false;

    //stop music
    themeSong.stop();

    //animations
    game.utils.fadeOut(background, 0, gameState);
    game.utils.fadeOut(level, 0, gameState);
    game.utils.fadeOut(floor, 0, gameState);
    game.utils.fadeIn(gameOverLabel, 0, gameState);
    game.utils.fadeIn(retryButton, 0, gameState);

    //enable retry button after half a second
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
        retryButton.events.onInputDown.addOnce(gameState.gameRetry, gameState);
        enterKey.onDown.add(gameState.gameRetry, gameState);
    });

};

Game.prototype.gameRetry = function() {

    //ajax retry
    game.utils.ajax.retry(game);
    game.init.ajax = false;


    //initialize level again
    game.init.gameInit = false;
    game.init.gameOver = false;
    game.init.score = 0;
    game.init.levelIndex = 0;

    game.init.ajax = true; //activates gameover only once

    gameState.state.restart(true, false);


};

Game.prototype.gameWin = function() {

    //ajax win
    game.utils.ajax.win(game);
    game.init.ajax = false;

    //stop song
    themeSong.stop();
    //load win state
    gameState.state.start('Win');
}

//COLLISIONS

Game.prototype.playerEnemyCollision = function(sprite, groupSprite) {
    //animation
    sprite.animations.play('explode');
    groupSprite.animations.play('explodeRed');
    //game over
    game.init.gameOver = true;
};

Game.prototype.playerTruckCollision = function(sprite, groupSprite) {
    //animation
    sprite.accelerate();
    sprite.animations.play('explode');
    groupSprite.body.velocity.x = game.init.enemySpeed;
    //game over
    game.init.gameOver = true;
};

Game.prototype.enemyTruckCollision = function(truck, enemy) {
    //only destroys if truck is on screen
    if (truck.x >= 0) {
        //animation
        enemy.body.velocity.x = game.init.carPedal();
        enemy.animations.play('explodeRed');
    }
};


//AJAX

Game.prototype.ajaxPut = function(data, url) {};

Game.prototype.ajaxGet = function(url) {


};

//ANIMATIONS

Game.prototype.animateBackground = function() {
    game.utils.tileAnimation(level, game.init.gameSpeedSlowest());
    game.utils.tileAnimation(floor, game.init.gameSpeed);
    game.utils.tileAnimation(road, game.init.gameSpeedSlower());
};

Game.prototype.newLevelStart = function() {
    //fadeOut animation
    background.frame = game.init.levelIndex + 1;
    game.utils.fadeOut(level, 0, gameState);
    game.utils.fadeOut(floor, 0, gameState);
    //increase level index
    game.init.levelIndex++;
    //fadeIn animation
    game.time.events.add(Phaser.Timer.SECOND * 1, gameState.newLevelEnd, gameState);
};


Game.prototype.newLevelEnd = function() {
    //if game is not over
    if (game.init.gameOver === false) {
        //load textures and fadein animations
        level.loadTexture('lv' + (game.init.levelIndex + 1));
        floor.loadTexture('floor' + (game.init.levelIndex + 1));
        game.utils.fadeIn(level, 0, gameState);
        game.utils.fadeIn(floor, 0, gameState);
    }
};

//OTHER

Game.prototype.enemyScoreUpdate = function() {
    //enemy world bound recycle
    enemyGroup.forEach(function(enemy) {

        if (enemy.x <= -5 * game.init.pixelScale && (game.init.gameOver === false)) {
            enemy.y = game.init.lanes()[0] + (game.init.lanes()[1] - game.init.lanes()[0]) * game.rnd.integerInRange(0, 1);
            enemy.x = 60 * game.init.pixelScale;
            game.init.score++;
        }

    });

    //update score label
    scoreLabel.text = game.init.score;
    scoreLabel.x = ((30 * game.init.pixelScale) - scoreLabel.width) / 2;

};

Game.prototype.checkHighscore = function(score) {
    //checks highscores and compares them with my score
    if (game.init.score > score) {
        console.log('new record!');
    }
};

Game.prototype.startSong = function() {
    themeSong.loopFull(0.5);
};



module.exports = Game;
},{"../entities/player.js":1}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

utils.ajax = {

    get: function(url, game) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                //on success
                var resp = JSON.parse(request.responseText);

                //api sanity check
                console.log('getData', resp);

                for (var i = 0; i < resp.length; i++) {
                    if (game.init.score > resp[i].highscore.score) {
                        console.log('new highscore table record!');
                    }
                }
            } else {
                //on failure
                console.log('We reached our target server, but it returned an error.');
            }
        };

        request.onerror = function() {
            console.log('There was a connection error of some sort.');
        };

        //sends request
        request.send();

    },

    put: function(data, url) {

        var request = new XMLHttpRequest();
        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        //sends request
        request.send(JSON.stringify(data));

    },

    loose: function(game) {
        //ajax loose data (gameId, highestScore, highestLevel)
        var looseData = {
            game: game.init.gameId,
            highscore: game.init.highscore,
            level: game.init.level
        };
        this.put(looseData, '/api/stats');
        this.get('/api/highscores', game);

        //api sanity check
        console.log('loosedata', looseData);
    },

    retry: function(game) {
        //ajax retry data (gameId and 1 new play)
        var retryData = {
            game: game.init.gameId,
            plays: 1
        };
        this.put(retryData, '/api/stats');

        //api sanity check
        console.log('retryData', retryData);
    },

    win: function(game) {
        //ajax win data (gameId and 1 new win)
        var winData = {
            game: game.init.gameId,
            wins: 1
        };
        this.put(winData, '/api/stats');

        //api sanity check
        console.log('winData', winData);
    }
};



module.exports = utils; //ended up looking cleaner than a class
},{}]},{},[2])