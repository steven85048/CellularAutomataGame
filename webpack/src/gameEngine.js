// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./Board.js');
var Selector = require('./Selector.js');
var TileDisplay = require('./TileDisplay.js');
var RulesetDisplay = require('./RulesetDisplay.js');
var GameNumber = require('./GameNumber.js');

// conig
var gameConfig = require('../configs/config.js');

// game number and ruleset for this level
var currLevel = GameNumber.currGame;

// get the ruleset for the current game number
var ruleSet;

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

    // create the rulesets
    ruleSet =  require('../games/' + GameNumber.currGame + '/ruleset.js')
    generateRulesetDisplay(ruleSet);

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}

// ================================= CELL GENERATION =================================

// create the ruleset display
function generateRulesetDisplay(ruleSet){
    // loop through rules and add a rulesetDisplay for each
    for (var i = 0 ; i < ruleSet.rules.length; i++){
        // get the current rule
        var currRule = ruleSet.rules[i];

        // create a new ruleset display
        var rulesetDisplay = new RulesetDisplay(PIXI, currRule, 25, 25);
        
        // create the enclosing Div
        var enclosingDiv = document.createElement("div");
        enclosingDiv.setAttribute('style', 'text-align: center;');

        // get the view for that app
        var view = rulesetDisplay.getApp().view;
        view.setAttribute('style', 'margin: auto; position: relative; display:block; margin-top: 30px;');

        // add that canvas to the enclosing div
        enclosingDiv.appendChild(view);

        // then add that div to the sidebar
        document.getElementById("sidebar").appendChild(enclosingDiv);

    }
}

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