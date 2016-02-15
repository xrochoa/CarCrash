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