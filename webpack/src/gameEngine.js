// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./Board.js');
var Selector = require('./Selector.js');
var TileDisplay = require('./TileDisplay.js');

var gameConfig = require('../configs/config.js');

var currLevel = "level1";

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
        resolution: 1,
    });

    // append the canvas of app
    document.getElementById("main_container").appendChild(app.view);

    // append a keydown event
    document.addEventListener('keydown', keyDownHandler)

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

// Tile Display object
var tileDisplay;

// ============================ GAME LOADING FUNCTIONS ===========================

// load the content that the application needs to run
function loadAssets() {
    PIXI.loader
        .add([
            "./assets/star.png",
            "./assets/t0.png",
            "./assets/tileset10.png",
        ])
        .load(gameCreate);
}

// Initialization of the first game state and the first draw of the map
function gameCreate() {
    console.log("initializing Game");

    // initialize tile selector
    tileDisplay = new TileDisplay(document, currLevel);

    // Initialize board object
    board = new Board(PIXI, app, tileDisplay);

    // Initialize selector object
    selector = new Selector(graphics, app);

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}

// Handle keyboard click
function keyDownHandler(key) {
    // ignore if key is not in 0-9 range
    if (key.keyCode < 48 || key.keyCode > 57)
        return;

    // normalize that key
    var normKey = key.keyCode - 48;

    // then select that bad boy
    tileDisplay.highlightCell(normKey);

    // notify the board that the tile has changed
    board.changeColor(normKey);

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
