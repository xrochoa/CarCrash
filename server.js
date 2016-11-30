var express1 = require('express');
var express2 = require('express');

var srcApp = express1();
var distApp = express2();

// Serves source code
var server1 = srcApp.listen(5000, function() {
    srcApp.use(express1.static(__dirname + '/src'));
    srcApp.use(express1.static(__dirname + '/bower_components'));
    srcApp.use('/api/highscores', function(req, res) {
        res.json(apiData);
    });
    srcApp.use('/', function(req, res) {
        res.sendFile(__dirname + '/src/index.html');
    });
    console.log('Source code listening at http://%s:%s', server1.address().address, server1.address().port);
});

// Serves distribution code
var server2 = distApp.listen(5001, function() {
    distApp.use('/', express2.static(__dirname + '/dist'));
    distApp.use('/api/highscores', function(req, res) {
        res.json(apiData);
    });
    distApp.use('/', function(req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });
    console.log('Distribution code listening at http://%s:%s', server2.address().address, server2.address().port);
});

//mock data
var apiData = [{
    "_id": "564138fd7e7adcf60d6c8d58",
    "game": "CarCrash",
    "__v": 0,
    "highscore": {
        "username": "Xaviro",
        "score": 102,
        "created": "2015-11-10T00:23:25.172Z"
    }
}, {
    "_id": "56413f667ca8899610e242b3",
    "game": "CarCrash",
    "__v": 0,
    "highscore": {
        "username": "henry",
        "score": 3,
        "created": "2015-11-10T00:50:46.024Z"
    }
}, {
    "_id": "56413f787ca8899610e242b4",
    "game": "CarCrash",
    "__v": 0,
    "highscore": {
        "username": "Ty",
        "score": 10,
        "created": "2015-11-10T00:51:04.159Z"
    }
}];