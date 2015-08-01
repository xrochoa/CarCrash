var mainState = {
    preload: function () {
        this.load.image('lv1', 'assets/lv1.png');
        this.load.image('road', 'assets/road.png');
        this.load.image('floor1', 'assets/floor1.png');
        this.load.spritesheet('car', 'assets/car.png', 5, 3, 8);
        this.load.spritesheet('enemy', 'assets/car.png', 5, 3, 8);
        this.load.image('truck', 'assets/truck.png');

    },

    create: function () {
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //enable key up, down, etc
        cursors = game.input.keyboard.createCursorKeys();


        this.lv1 = this.add.tileSprite(0, 0, 30, 60 * pixelScale, 'lv1');
        this.scaleSprite(this.lv1);




        this.floor1 = this.add.tileSprite(0, 45 * pixelScale, 30, 15, 'floor1');
        this.scaleSprite(this.floor1);


        this.road = this.add.tileSprite(0, 34 * pixelScale, 30, 13, 'road');
        this.scaleSprite(this.road);


        this.trucks = this.add.group();
        this.trucks.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.trucks);


        for (var i = 0; i < 2; i++) {
            this.truck = this.trucks.create(-9 * pixelScale, lanes[i], 'truck');
            this.scaleSprite(this.truck);
        }


        this.car = this.add.sprite(5 * pixelScale, 36 * pixelScale, 'car');
        this.car.animations.add('explode', [1, 3, 4, 6, 7, 2], 10, false).killOnComplete = true;


        this.scaleSprite(this.car);
        this.physics.arcade.enable(this.car);




        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        //adds physics to each member
        this.physics.arcade.enable(this.enemies);

        for (var i = 0; i < 2; i++) {
            this.enemy = this.enemies.create(30 * pixelScale * (1 + i), lanes[i], 'enemy');
            this.enemy.animations.add('explodeRed', [1, 3, 4, 6, 7, 2], 10, false).killOnComplete = true;
            this.scaleSprite(this.enemy);

        }


        this.label = this.add.text(100, 100, 'score');







    },

    update: function () {
        //backckground movement
        this.lv1.tilePosition.x -= gameSpeedSlowest;
        this.floor1.tilePosition.x -= gameSpeed;
        this.road.tilePosition.x -= gameSpeedSlower;


        //first click game start
        if ((gameInit === false) && (cursors.down.isDown || cursors.up.isDown || game.input.activePointer.isDown)) {
            this.gameStart();
        }

        //car movement with click or mouse
        if ((cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > lanes[2])) && ((this.car.y === lanes[0]) || (this.car.y === lanes[1]))) {
            this.carAccelerates(this.car);
            game.add.tween(this.car).to({
                y: lanes[1]
            }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);

        } else if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < lanes[2])) && ((this.car.y === lanes[0]) || (this.car.y === lanes[1]))) {

            this.carAccelerates(this.car);
            game.add.tween(this.car).to({
                y: lanes[0]
            }, 300, Phaser.Easing.Sinusoidal.InOut, true, 0);

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

        this.label.text = score;


        //truck collide action
        game.physics.arcade.overlap(this.car, this.trucks, this.truckExplode, null, this);






        //enemy collide action

        game.physics.arcade.overlap(this.car, this.enemies, this.carExplode, null, this);

        //enemy collide with truck

        if (gameOver === true) {
            game.physics.arcade.overlap(this.truck, this.enemies, this.enemyExplode, null, this);
        };






    },


    render: function () {


    },

    truckExplode: function (car, truck) {
        car.animations.play('explode');
        this.carAccelerates(this.car);
        truck.body.velocity.x = enemySpeed;
        this.gameOver();
        this.truck = truck;
        
        


    },
    //first and second objects are passed in order from overlap
    carExplode: function (car, enemy) {
        car.animations.play('explode');
        enemy.animations.play('explodeRed');
        this.gameOver();
    },
    enemyExplode: function (truck, enemy) {
        enemy.animations.play('explodeRed');
        this.carAccelerates(enemy);

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
    gameOver: function () {
        gameOver = true;

    },
    carAccelerates: function (sprite) {
        sprite.body.velocity.x = carPedal;

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