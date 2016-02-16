'use strict';

var utils = {

    //solution for circular dependencies = dependency injection
    fadeOut: function(sprite, seconds, dependency) {
        dependency.game.add.tween(sprite).to({
            alpha: 0
        }, seconds, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    fadeIn: function(sprite, seconds, dependency) {
        dependency.game.add.tween(sprite).to({
            alpha: 1
        }, seconds, Phaser.Easing.Sinusoidal.InOut, true, 0);
    },
    tileAnimation: function(sprite, speed) {
        sprite.tilePosition.x -= speed;
    }

};

utils.ajax = {

    get: function(url, game) {

        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                //on success
                var resp = JSON.parse(request.responseText);

                //api sanity check
                console.log('getData', resp);

                for (var i = 0; i < resp.length; i++) {
                    if (game.init.score > resp[i].highscore.score) {
                        console.log('new highscore table record!');
                    }
                }
            } else {
                //on failure
                console.log('We reached our target server, but it returned an error.');
            }
        };

        request.onerror = function() {
            console.log('There was a connection error of some sort.');
        };

        //sends request
        request.send();

    },

    put: function(data, url) {

        var request = new XMLHttpRequest();
        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        //sends request
        request.send(JSON.stringify(data));

    },

    loose: function(game) {
        //ajax loose data (gameId, highestScore, highestLevel)
        var looseData = {
            game: game.init.gameId,
            highscore: game.init.highscore,
            level: game.init.level
        };
        this.put(looseData, '/api/stats');
        this.get('/api/highscores', game);

        //api sanity check
        console.log('loosedata', looseData);
    },

    retry: function(game) {
        //ajax retry data (gameId and 1 new play)
        var retryData = {
            game: game.init.gameId,
            plays: 1
        };
        this.put(retryData, '/api/stats');

        //api sanity check
        console.log('retryData', retryData);
    },

    win: function(game) {
        //ajax win data (gameId and 1 new win)
        var winData = {
            game: game.init.gameId,
            wins: 1
        };
        this.put(winData, '/api/stats');

        //api sanity check
        console.log('winData', winData);
    }
};



module.exports = utils; //ended up looking cleaner than a class