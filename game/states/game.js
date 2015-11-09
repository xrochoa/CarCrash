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