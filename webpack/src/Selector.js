// get the config variable
var gameConfig = require('../configs/config.js');

var offsetMainX = gameConfig.gameConfig.offsetX;
var offsetMainY = gameConfig.gameConfig.offsetY;

var cellWidth = gameConfig.gameConfig.boardCellWidth;
var cellHeight = gameConfig.gameConfig.boardCellHeight;

// global graphics object
var graphics;
var app;

// ========================================= CLASS INITIALIZATION ===========================

var Selector = function(aGraphics, aApp) {
    // initialize the global graphics object
    graphics = aGraphics;
    app = aApp;
}

module.exports = Selector;

// ==================================== PUBLIC REDRAW METHOD ========================

// whenever the mouse moves, call this function
Selector.prototype.redrawMarker = function(positionX, positionY) {
    // first clear the graphics
    graphics.clear();

    // get the grid coordinates
    var gridX = Math.floor((positionX + offsetMainX)/cellWidth);
    var gridY = Math.floor((positionY + offsetMainY)/cellHeight);

    // draw the updated marker position
    var markerX = gridX * cellWidth;
    var markerY = gridY * cellHeight;

    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawRect(markerX, markerY , cellWidth, cellHeight);

    app.stage.addChild(graphics);

}