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