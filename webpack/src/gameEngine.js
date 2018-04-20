// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./Board.js');
var Selector = require('./Selector.js');
var TileDisplay = require('./TileDisplay.js');
var RulesetDisplay = require('./RulesetDisplay.js');

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

// wait until page is loaded
window.onload = function () {
    initialConfig();
}

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

    // then add the tile display
    var tileDisplayDiv = document.createElement("div");
    tileDisplayDiv.id = "tile_display";
    document.getElementById("main_container").appendChild(tileDisplayDiv);

    // append a keydown event
    document.addEventListener('keydown', keyDownHandler)

    // add generate button onclick
    document.getElementById("generate_button").addEventListener("click", generateCells, false);

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

// ruleset display object
var rulesetDisplay;

// ============================ GAME LOADING FUNCTIONS ===========================

// load the content that the application needs to run
function loadAssets() {
    PIXI.loader
        .add([
            "./assets/tileset10.png",
        ])
        .load(gameCreate);
}

// Initialization of the first game state and the first draw of the map
function gameCreate() {
    // initialize tile selector
    tileDisplay = new TileDisplay(document, currLevel);

    // Initialize board object
    board = new Board(PIXI, app, tileDisplay);

    // Initialize selector object
    selector = new Selector(graphics, app);

    // TESTING
    var currRule1 = {
        points: [[0,0,1], [1,0,1], [2,0,1], [3,0,1]],
        generating: [[-1,0,1],[4,0,1]],
        width: 4,
        height: 1,
    };

    var currRule2 = {
        points: [[0,0,1], [1,0,1], [2,0,1], [0,1,1], [2,1,1], [0,2,1], [2,2,1], [0,3,1], [1,3,1], [2,3,1]],
        generating: [[1,1,1],[1,2,1]],
        width: 3,
        height: 4,
    };

    // Initialize ruleset display object and add to the view
    rulesetDisplay = new RulesetDisplay(PIXI, currRule1, 25, 25);
    var rulesetDisplay2 = new RulesetDisplay(PIXI, currRule2, 25, 25);

    var enclosingDiv = document.createElement("div");
    enclosingDiv.setAttribute('style', 'text-align: center;');

    var view1 = rulesetDisplay.getApp().view;
    var view2 = rulesetDisplay2.getApp().view;

    view1.setAttribute('style', 'margin: auto; position: relative; display:block;');
    view2.setAttribute('style', 'margin: auto; position: relative; display:block;');

    enclosingDiv.appendChild(view1);
    enclosingDiv.appendChild(view2);

    document.getElementById("sidebar").appendChild(enclosingDiv);

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}

// ================================= CELL GENERATION =================================

// generate cells on button click
function generateCells() {
    board.generateCells();
}

// ================================= MAIN GAME LOOP ====================================

// The constantly ticking game loop (60 times per second)
function gameLoop(delta){
    // get mouse position
    var global = app.renderer.plugins.interaction.mouse.global;

    mousePosition[0] = global.x;
    mousePosition[1] = global.y;

    // redraw highlight
    selector.redrawMarker(mousePosition[0], mousePosition[1]);

    // render the blur
    board.renderBlur();
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