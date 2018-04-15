// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./tileHandling.js');

var gameConfig = require('../configs/config.js');

// ===============================================================================
// ========================= GAME STATICS ========================================
// ===============================================================================

// Main PIXIJS app variable
var app;

// sizes
var boardHeight;
var boardWidth;
var cellHeight;
var cellWidth;

var graphics = new PIXI.Graphics();

// ===============================================================================
// ========================= CONFIG SETUP ========================================
// ===============================================================================

initialConfig();

function initialConfig() {
    initGlobals(gameConfig);

    // Start the pixi application based on the game config
    app = new PIXI.Application({
        width: boardWidth,
        height: boardHeight,
        antialias: true,
        transparent: false,
        resolution: 1
    });

    // append the canvas of app
    document.body.appendChild(app.view);

    // after the configuration is loaded, load the content the game needs
    loadAssets();
}

// Extract the globals from the config data retrieved from server
function initGlobals(config) {
    boardHeight = gameConfig.boardState.initialHeight;
    boardWidth = gameConfig.boardState.initialWidth;

    cellHeight = gameConfig.gameConfig.boardCellHeight;
    cellWidth = gameConfig.gameConfig.boardCellWidth;
}

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// ========================= GAME VARIABLES ======================================

// Mouse position
var mousePosition = new Array(2);

// Board object
var board;

// define the offset for the board
var offsetMainX = 0;
var offsetMainY = 0;

// ============================ GAME LOADING FUNCTIONS ===========================

// load the content that the application needs to run
function loadAssets() {
    PIXI.loader
        .add([
            "./assets/star.png",
            "./assets/t0.png",
            "./assets/tileset.png",
        ])
        .load(gameCreate);
}

// Initialization of the first game state and the first draw of the map
function gameCreate() {
    console.log("initializing Game!");

    // Initialize board object
    board = new Board(PIXI, app);

    // marker init
    initMarker();

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}

// Initialize the marker highlight that appears when the user hovers or clicks on a cell
function initMarker() {
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawRect(0 + offsetMainX,0 + offsetMainY,cellWidth, cellHeight);

    app.stage.addChild(graphics);
}

// The constantly ticking game loop (60 times per second)
function gameLoop(delta){
    // first clear the graphics
    graphics.clear();

    // get mouse position
    var global = app.renderer.plugins.interaction.mouse.global;

    mousePosition[0] = global.x;
    mousePosition[1] = global.y;

    // get the grid coordinates
    var gridX = Math.floor((mousePosition[0] + offsetMainX)/cellWidth);
    var gridY = Math.floor((mousePosition[1] + offsetMainY)/cellHeight);

    // draw the updated marker position
    var markerX = gridX * cellWidth;
    var markerY = gridY * cellHeight;

    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawRect(markerX, markerY , cellWidth, cellHeight);

    app.stage.addChild(graphics);


}