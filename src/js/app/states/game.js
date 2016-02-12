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