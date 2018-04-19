// ============================ GLOBALS ==========================
var boundsX;
var boundsY;

var PIXI;
var app;

// current rule for testing purposes
var currRule = {
    points: [[0,0,1], [1,0,1], [2,0,1], [3,0,1]],
    generating: [[-1,0,1],[4,0,1]],
    width: 4,
    height: 1,
};

// =========================== CLASS INIT ========================

var RulesetDisplay = function(aBoundsX, aBoundsY, aPIXI) {
    // set globals
    boundsX = aBoundsX;
    boundsY = aBoundsY;
    PIXI = aPIXI;

    // Create the pixi applications
    app = new PIXI.Application({
        width: boundsX,
        height: boundsY,
        antialias: true,
        transparent: false,
        resolution: 1,
    });

};

module.exports = RulesetDisplay;

// ======================= DISPLAY ===============================

// getter method for the app
RulesetDisplay.prototype.getApp = function() {
    return app;
}