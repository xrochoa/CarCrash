sCarCrash = function () {
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
    
    
};

var CarCrash = {};

CarCrash.bootxx = function(game) {};

CarCrash.bootxx.prototype = {

    preload: function() {


    },
    create: function() {
        /**
        // only one pointer at a time (mouse vs touch)
        this.input.maxPointers = 1;
        //pasue when opening another tab
        this.stage.disableVisibilityChange = false;
        //shows everything that is on the stage, not cut
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 270;
        this.scale.minHeight = 489;
        //centers the game
        this.scale.pageAlignHorizontally = true;
        //always portrait for mobile
        this.pageAlignVertically = true;
        this.forcePortrait = true;
        //forces the screen size
        this.scale.setScreenSize(true);
        //adds pointer
        this.input.addPointer();
        this.stage.backgroundColor = 'white';

**/

    }
}