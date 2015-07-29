var mainState = {
    preload: function () {
        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('road', 'assets/road.png');
        this.load.image('floor1', 'assets/floor1.png');
        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('truck', 'assets/truck.png');

    },

    create: function () {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();


        this.lv1 = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'lv1');
        this.scaleSprite(this.lv1);




        this.floor1 = this.add.tileSprite(0, 45 * pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor1);


        this.road = this.add.tileSprite(0, 34 * pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);

        this.truck1 = this.add.sprite(-9 * pixelScale, lane1, 'truck');
        this.scaleSprite(this.truck1);
        game.physics.arcade.enable(this.truck1);


        this.truck2 = this.add.sprite(-9 * pixelScale, lane2, 'truck');
        this.scaleSprite(this.truck2);
        game.physics.arcade.enable(this.truck2);




        this.car = this.add.sprite(5 * pixelScale, 36 * pixelScale, 'car');
        this.car.animations.add('explode', [1, 3, 4, 6, 7, 2], 10, false).killOnComplete = true;


        this.scaleSprite(this.car);
        game.physics.arcade.enable(this.car);




        this.enemies = game.add.group();
        this.enemies.enableBody = true;


        this.enemy1 = this.enemies.create(30 * pixelScale, lane1, 'enemy');
        this.scaleSprite(this.enemy1);
        game.physics.arcade.enable(this.enemy1);


        this.enemy2 = this.enemies.create(60 * pixelScale, lane2, 'enemy');
        this.scaleSprite(this.enemy2);
        game.physics.arcade.enable(this.enemy2);


        this.label = game.add.text(100, 100, "Score");
        this.score = 0;







    },

    update: function () {
        this.lv1.tilePosition.x -= gameSpeedSlowest;
        this.floor1.tilePosition.x -= gameSpeed;
        this.road.tilePosition.x -= gameSpeedSlower;



        if ((gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            this.gameStart();
        }

        if ((cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > middleLane)) && ((this.car.y === lane1) || (this.car.y === lane2))) {
            this.car.body.velocity.x = carPedal;
            game.add.tween(this.car).to({
                y: lane2
            }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);

        } else if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < middleLane)) && ((this.car.y === lane1) || (this.car.y === lane2))) {

            this.car.body.velocity.x = carPedal;
            game.add.tween(this.car).to({
                y: lane1
            }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);

        }
        if (this.enemy1.x <= -this.enemy1.width) {
            this.enemy1.y = lane1 + (lane2 - lane1) * game.rnd.integerInRange(0, 1);
            this.enemy1.x = 60 * pixelScale;
            this.score++;
        }

        if (this.enemy2.x <= -this.enemy2.width) {
            this.enemy2.y = lane1 + (lane2 - lane1) * game.rnd.integerInRange(0, 1);

            this.enemy2.x = 60 * pixelScale;
            this.score++;

        }

        this.label.text = this.score;


        if (Phaser.Rectangle.intersects(this.car.getBounds(), this.truck1.getBounds())) {
            this.truck1.body.velocity.x = enemySpeed;
            this.car.kill();


        }
        if (Phaser.Rectangle.intersects(this.car.getBounds(), this.truck2.getBounds())) {
            this.truck2.body.velocity.x = enemySpeed;
            this.car.kill();



        }

        if ((Phaser.Rectangle.intersects(this.car.getBounds(), this.enemy1.getBounds()) || Phaser.Rectangle.intersects(this.car.getBounds(), this.enemy2.getBounds())) && (gameOver === false)) {
            this.carExplode();
        }






    },


    render: function () {


    },

    carExplode: function () {
        this.car.animations.play('explode');
        gameOver = true;
    },

    scaleSprite: function (sprite) {
        sprite.scale.x = pixelScale;
        sprite.scale.y = pixelScale;
    },

    gameStart: function () {
        this.car.body.gravity.x = gravity;
        this.enemy1.body.velocity.x = -enemySpeed;
        this.enemy2.body.velocity.x = -enemySpeed;

        gameInit = true;

    }
};

var mainMenu = {
    preload: function () {
        this.load.image('mainMenu', 'assets/lv1.png');


    },
    create: function () {
        this.backgroundImage = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'mainMenu');
        this.backgroundImage.inputEnabled = true;
        this.backgroundImage.events.onInputDown.addOnce(this.startGame, this);



    },
    update: function () {

    },
    startGame: function () {
        this.state.start('main');
    }

}
