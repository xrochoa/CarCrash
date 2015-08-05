var titleIntro = {
    preload: function () {
        this.load.image('menu', 'assets/lv1.png');
        this.load.image('truck', 'assets/truck.png');

    },

    create: function () {

        game.stage.backgroundColor = 0x323333;

        //level 1
        this.menu = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'menu');
        this.scaleSprite(this.menu);
        this.menu.inputEnabled = true;
        this.menu.events.onInputDown.addOnce(this.startGame, this);


        //trucks...needed to make pixelTION WORK
        this.trucks = this.add.group();
        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * pixelScale, lanes[i], 'truck');
            //this.scaleSprite(this.truck);
        }



    },

    update: function () {

    },

    render: function () {},


    scaleSprite: function (sprite) {
        sprite.scale.x = pixelScale;
        sprite.scale.y = pixelScale;
    },
    startGame: function () {
        this.state.start('carCrash');
    }
};


var carCrash = {
    preload: function () {
        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('road', 'assets/road.png');
        this.load.image('floor1', 'assets/floor1.png');
        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.spritesheet('enemy', 'assets/enemy.png', 5, 3, 8);
        this.load.image('truck', 'assets/truck.png');
        this.load.bitmapFont('litto', 'assets/litto.png', 'assets/litto.xml');
        this.load.image('over', 'assets/over.png');
        this.load.image('retry', 'assets/retry.png');
    },

    create: function () {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //enable key up, down, etc
        cursors = game.input.keyboard.createCursorKeys();
        game.stage.backgroundColor = 0xff5040;

        //level 1
        this.lv1 = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'lv1');
        this.scaleSprite(this.lv1);

        //floor1
        this.floor1 = this.add.tileSprite(0, 45 * pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor1);

        //road
        this.road = this.add.tileSprite(0, 34 * pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);

        //trucks
        this.trucks = this.add.group();
        this.trucks.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.trucks);
        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * pixelScale, lanes[i], 'truck');
            this.scaleSprite(this.truck);
        }

        //player
        this.car = this.add.sprite(5 * pixelScale, 36 * pixelScale, 'car');
        this.car.animations.add('explode', [1, 3, 4, 6, 7, 2], 10, false).killOnComplete = true;
        this.scaleSprite(this.car);
        this.physics.arcade.enable(this.car);

        //enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.enemies);
        for (var i = 0; i < 2; i++) {
            this.enemy = this.enemies.create(30 * pixelScale * (1 + i), lanes[i], 'enemy');
            this.enemy.animations.add('explodeRed', [0, 1, 2, 3, 5, 4], 10, false).killOnComplete = true;
            this.enemy.frame = 7;
            this.scaleSprite(this.enemy);

        }

        //score label
        this.bitmapTextFont = this.add.bitmapText(0, 5 * pixelScale, 'litto', 0, pixelScale);


        //gameover label
        this.over = this.add.sprite(5 * pixelScale, 15 * pixelScale, 'over');
        this.scaleSprite(this.over);
        this.over.alpha = 0;

        //retry lable
        this.retry = this.add.sprite(9 * pixelScale, 34 * pixelScale, 'retry');
        this.scaleSprite(this.retry);
        this.retry.alpha = 0;


    },

    update: function () {
        //backckground movement
        this.backgroundAnimation();


        //first click game start
        if ((gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            this.gameStart();
        }

        //triggers game over
        if (gameOver === true) {
            this.gameOver();
        }

        //car movement with click or mouse
        if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < lanes[2])) && ((this.car.y === lanes[0]) || (this.car.y === lanes[1]))) {
            this.carMoveUp();
        } else if (
            (cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > lanes[2])) && ((this.car.y === lanes[0]) || (this.car.y === lanes[1]))) {
            this.carMoveDown();
        }

        //enemy world bound recycle and score
        this.enemies.forEach(
            function (enemy) {
                if (enemy.x <= -5 * pixelScale && (gameOver === false)) {
                    enemy.y = lanes[0] + (lanes[1] - lanes[0]) * game.rnd.integerInRange(0, 1);
                    enemy.x = 60 * pixelScale;
                    score++;
                }
            }
        );

        //temporary score label
        this.bitmapTextFont.text = score;
        this.bitmapTextFont.x = ((30 * pixelScale) - this.bitmapTextFont.width) / 2;

        //- this.bitmapTextFont.width(game.world.centerX )

        //truck collide action
        game.physics.arcade.overlap(this.car, this.trucks, this.truckExplode, null, this);

        //enemy collide action
        game.physics.arcade.overlap(this.car, this.enemies, this.carExplode, null, this);

        //enemy collide with truck
        game.physics.arcade.overlap(this.truck, this.enemies, this.enemyExplode, null, this);
    },

    render: function () {},

    backgroundAnimation: function () {
        this.lv1.tilePosition.x -= gameSpeedSlowest;
        this.floor1.tilePosition.x -= gameSpeed;
        this.road.tilePosition.x -= gameSpeedSlower;
    },
    carMoveUp: function () {
        this.carAccelerates(this.car);
        game.add.tween(this.car).to({
            y: lanes[0]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    carMoveDown: function () {
        this.carAccelerates(this.car);
        game.add.tween(this.car).to({
            y: lanes[1]
        }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },

    //first and second objects are passed in order from overlap
    carExplode: function (car, enemy) {
        car.animations.play('explode');
        enemy.animations.play('explodeRed');
        gameOver = true;
    },

    truckExplode: function (car, truck) {
        this.carAccelerates(this.car);
        car.animations.play('explode');
        truck.body.velocity.x = enemySpeed;
        gameOver = true;

    },

    enemyExplode: function (truck, enemy) {
        //only destroys if truck is moving
        if (truck.body.velocity.x === enemySpeed) {
            enemy.animations.play('explodeRed');
            this.carAccelerates(enemy);
        }
    },

    scaleSprite: function (sprite) {
        sprite.scale.x = pixelScale;
        sprite.scale.y = pixelScale;
    },

    gameStart: function () {
        this.car.body.gravity.x = gravity;
        //speed for all in group
        this.enemies.setAll('body.velocity.x', -enemySpeed);
        gameInit = true;

    },

    gameOver: function (sprite) {
        this.fadeOut(this.lv1);
        this.fadeOut(this.floor1);
        this.fadeIn(this.over);
        this.fadeIn(this.retry);



    },

    carAccelerates: function (sprite) {
        sprite.body.velocity.x = carPedal;
    },

    fadeOut: function (sprite) {
        game.add.tween(sprite).to({
            alpha: 0
        }, 50, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    fadeIn: function (sprite) {
        game.add.tween(sprite).to({
            alpha: 1
        }, 50, Phaser.Easing.Sinusoidal.InOut, true, 0);
    }
};
