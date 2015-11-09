var car = function (game, x, y) {
    car.Sprite.call(this, game, x, y, 'car');
    game.add.existing(this);
}

car.prototype = Object.create(Phaser.Sprite.prototype);
car.prototype.constructor = car;

car.prototype.update = function() {
};

module.exports = car;
