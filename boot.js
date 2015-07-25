var mainState = {
    preload: function() {
        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('road', 'assets/road.png');
        this.load.image('floor1', 'assets/floor1.png');
        this.load.image('car', 'assets/car.png');
        this.load.image('enemy', 'assets/enemy.png');
    },

    create: function() {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        cursors = game.input.keyboard.createCursorKeys();


        this.lv1 = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'lv1');
        this.scaleSprite(this.lv1);




        this.floor1 = this.add.tileSprite(0, 45 * pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor1);


        this.road = this.add.tileSprite(0, 34 * pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);


        this.car = this.add.sprite(5 * pixelScale, 36 * pixelScale, 'car');
        this.scaleSprite(this.car);
        game.physics.arcade.enable(this.car);

        this.enemies = game.add.group();
        this.enemies.enableBody = true;


        this.enemy1 = this.enemies.create(30 * pixelScale, lane1, 'enemy');
        this.scaleSprite(this.enemy1);

        this.enemy2 = this.enemies.create(60 * pixelScale, lane2, 'enemy');
        this.scaleSprite(this.enemy2);







    },

    update: function() {
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
        if (this.enemy1.x < 0) {
            this.enemy1.x = 60 * pixelScale;
        }

        if (this.enemy2.x < 0) {
            this.enemy2.x = 60 * pixelScale;
        }







    },

    render: function() {


    },

    scaleSprite: function(sprite) {
        sprite.scale.x = pixelScale;
        sprite.scale.y = pixelScale;
    },

    gameStart: function() {
        this.car.body.gravity.x = gravity;
        this.enemy1.body.velocity.x = -300;
        this.enemy2.body.velocity.x = -300;

        gameInit = true;

    }
};

var mainMenu = {
    preload: function() {
        this.load.image('mainMenu', 'assets/lv1.png');


    },
    create: function() {
        this.backgroundImage = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'mainMenu');
        this.backgroundImage.inputEnabled = true;
        this.backgroundImage.events.onInputDown.addOnce(this.startGame, this);



    },
    update: function() {

    },
    startGame: function() {
        this.state.start('main');
    }

}