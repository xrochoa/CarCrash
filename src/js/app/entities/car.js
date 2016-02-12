var car = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'car');
    game.add.existing(this);
}

car.prototype = Object.create(Phaser.Sprite.prototype);
car.prototype.constructor = car;

var cursors = game.input.keyboard.createCursorKeys();


car.prototype.update = function() {

    //car movement with click or mouse
    if ((cursors.up.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y < init.lanes()[2])) && ((this.car.y === init.lanes()[0]) || (this.car.y === init.lanes()[1]))) {
        this.carMoveUp();
    } else if (
        (cursors.down.isDown || (game.input.activePointer.isDown && game.input.activePointer.position.y > init.lanes()[2])) && ((this.car.y === init.lanes()[0]) || (this.car.y === init.lanes()[1]))) {
        this.carMoveDown();
    }
};

module.exports = car;