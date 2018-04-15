// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./Board.js');
var Selector = require('./Selector.js');

var gameConfig = require('../configs/config.js');

// ===============================================================================
// ========================= GAME STATICS ========================================
// ===============================================================================

// Main PIXIJS app variable
var app;

// graphics object
var graphics = new PIXI.Graphics();

// ===============================================================================
// ========================= CONFIG SETUP ========================================
// ===============================================================================

initialConfig();

function initialConfig() {
    // Start the pixi application based on the game config
    app = new PIXI.Application({
        width: gameConfig.boardState.initialWidth,
        height: gameConfig.boardState.initialHeight,
        antialias: true,
        transparent: false,
        resolution: 1
    });

    // append the canvas of app
    document.body.appendChild(app.view);

    // after the configuration is loaded, load the content the game needs
    loadAssets();
}

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// ========================= GAME VARIABLES ======================================

// Mouse position
var mousePosition = new Array(2);

// Board object
var board;

// Selector object (highlight cells)
var selector;

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

    // Initialize selector object
    selector = new Selector(graphics, app);

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}


// The constantly ticking game loop (60 times per second)
function gameLoop(delta){
    // get mouse position
    var global = app.renderer.plugins.interaction.mouse.global;

    mousePosition[0] = global.x;
    mousePosition[1] = global.y;

    // redraw highlight
    selector.redrawMarker(mousePosition[0], mousePosition[1]);
}