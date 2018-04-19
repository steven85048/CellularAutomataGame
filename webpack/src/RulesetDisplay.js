// ============================ GLOBALS ==========================
var boundsX;
var boundsY;

var PIXI;
var app;

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

    // append the canvas of app
    document.getElementById("main_container").appendChild(app.view);
};

module.exports = RulesetDisplay;

// ======================= DISPLAY ===============================

// getter method for the app
RulesetDisplay.prototype.getApp = function() {
    return app;
}