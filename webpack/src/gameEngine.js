// IMPORTS

var PIXI = require('pixi.js')
var Board = require('./Board.js');
var Selector = require('./Selector.js');
var TileDisplay = require('./TileDisplay.js');
var RulesetDisplay = require('./RulesetDisplay.js');
var GameNumber = require('./GameNumber.js');
var GameEnd = require('./GameEnd.js');
var Undo = require('./Undo.js');

// conig
var gameConfig = require('../configs/config.js');

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

    // then add the tile display
    var tileDisplayDiv = document.createElement("div");
    tileDisplayDiv.id = "tile_display";
    document.getElementById("main_container").appendChild(tileDisplayDiv);

    // set the style and append the canvas of app
    app.view.setAttribute('style', 'float:left');
    document.getElementById("main_container").appendChild(app.view);

    // append a keydown event
    document.addEventListener('keydown', keyDownHandler)

    // add generate button onclick
    document.getElementById("generate_button").addEventListener("click", generateCells, false);
    document.getElementById("undo_button").addEventListener("click", undoOperation, false);
    document.getElementById("refresh_button").addEventListener("click", refreshLevel, false);

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
    // get the level from url
    setLevel();

    // initialize tile selector
    tileDisplay = new TileDisplay(document);

    // Initialize board object
    board = new Board(PIXI, app, tileDisplay);

    // Initialize selector object
    selector = new Selector(graphics, app);

    // create the rulesets
    ruleSet =  require('../games/' + GameNumber.currGame + '/ruleset.js')
    generateRulesetDisplay(ruleSet.accepting_rule, true);
    generateRulesetDisplay(ruleSet.rules, false);

    // init game ticker
    app.ticker.add(delta => gameLoop(delta));
    
}

// set the level based on the url
function setLevel() {
    // get the url
    var url_string = window.location.href;

    // convert to URL object and get parameters
    var url = new URL(url_string);
    var levelNum = url.searchParams.get("level")

    // only set if the parameter is nonempty
    if (levelNum != null){
        GameNumber.setProblem(levelNum);
    }
}

// ================================= CELL GENERATION =================================

// create the ruleset display
function generateRulesetDisplay(ruleSet, finalRule){
    var accordionDiv = document.getElementById("accordion");

    // loop through rules and add a rulesetDisplay for each
    for (var i = 0 ; i < ruleSet.length; i++){
        // get the current rule
        var currRule = ruleSet[i];

        // create a new ruleset display
        var rulesetDisplay = new RulesetDisplay(PIXI, currRule, 15, 15);
        
        // get the view for that app
        var view = rulesetDisplay.getApp().view;
        view.setAttribute('style', 'margin: auto; position: relative; display:block;');

        // ======================= CREATE THE TOGGLE ================================
        var ruleNum;

        if (!finalRule)
            ruleNum = "Rule " + (i+1);
        else
            ruleNum = "Accepting Rule";

        var headerNum = "Header " + (i+1);

        // create the enclosing Div
        var cardDiv = document.createElement("div");
        cardDiv.setAttribute('class', 'card');

        // create the card header
        var cardHeader = document.createElement('div');
        cardHeader.setAttribute('class', 'card-header');
        cardHeader.id = headerNum;

        if (finalRule){
            cardHeader.setAttribute('style', 'background-color: #f47142');
        }

        // create the header text
        var h5 = document.createElement('h5');
        h5.setAttribute('class', 'mb-0');
        h5.setAttribute('style', 'text-align:center');

        // create the data toggle for the rule
        var toggle = document.createElement('button');
        toggle.setAttribute('class', 'btn btn-link');
        toggle.setAttribute('data-toggle', 'collapse');
        toggle.setAttribute('data-target', '#' + ruleNum);
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-controls', ruleNum);

        toggle.innerHTML = ruleNum;

        // append the children
        h5.appendChild(toggle);
        cardHeader.appendChild(h5);
        cardDiv.appendChild(cardHeader);

        // ====================== CREATE THE DIV CONTENTS ==============================

        // Create the collapsable div
        var collapsableDiv = document.createElement('div');

        collapsableDiv.id = ruleNum;
        collapsableDiv.setAttribute('class', 'collapse show');
        collapsableDiv.setAttribute('aria-labelledby', headerNum);
        collapsableDiv.setAttribute('data-parent', '#accordion');

        // Create the div body
        var canvasBody = document.createElement('div');
        canvasBody.setAttribute('class', 'card-body');
        canvasBody.setAttribute('style', 'text-align: center;');

        // append the elements
        canvasBody.appendChild(view);
        collapsableDiv.appendChild(canvasBody);
        cardDiv.appendChild(collapsableDiv);

        // add that to the final div
        accordionDiv.appendChild(cardDiv);
    }
}

// ====================== CLICK LISTENERS =================================

// generate cells on button click
function generateCells() {
    if (tileDisplay.generationCheck()){
        // save the game state
        Undo.pushMemory();

        // consume generation
        tileDisplay.consumeGeneration();

        // then generate cells
        board.generateCells();
    }
}

// for undoing operations
function undoOperation() {
    Undo.popMemory();
}

// refresh the level
function refreshLevel() {
    location.reload();
}

// ================================= MAIN GAME LOOP ====================================

// The constantly ticking game loop (60 times per second)
function gameLoop(delta){
    // check if game has been completed
    if (GameEnd.problemSolved){
        document.body.setAttribute('style', 'background-color: black');
    }

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