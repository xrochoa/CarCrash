module.exports = {

    pixelScale: 10,
    gameSpeed: 0.5,


    gameInit: false,
    gameOver: false,
    enemySpeed: 300,

    score: 0,
    nextLevel: [10,100,1000],
    fadeInLevel: 11,
    levelColor: [0xffe359, 0xfe9040, 0x70efff],
    levelIndex: 0,
    win: 10000,

    //depend on gameSpeed
    gameSpeedSlower: function() {
        return this.gameSpeed / 2;
    },
    gameSpeedSlowest: function() {
        return this.gameSpeed / 10;
    },


    //depend on pixelscale
    lanes: function() {
        var lane1 = 36 * this.pixelScale;
        var lane2 = 42 * this.pixelScale;
        var middleLane = 40.5 * this.pixelScale;
        return [lane1, lane2, middleLane];
    },
    gravity: function() {
        return -35 * this.pixelScale;
    },
    carPedal: function() {
        return 10 * this.pixelScale;
    },
    gameWidth: function() {
        return 30 * this.pixelScale;
    },
    gameHeight: function() {
        return 60 * this.pixelScale;
    }


};

//enemies;
/*


*/