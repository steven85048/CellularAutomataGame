// ============================ GLOBALS ==========================

// game config
var gameConfig = require('../configs/config.js');
var resources;

// dom object
var document;
var container;

// dom objects 
var mainDivs = [];
var resourceText = [];

// resource count
var numResources = [];
var generations;

// keep track of highlighted
var currHighlighted = -1;

var numTiles = gameConfig.gameConfig.numTiles;

var tileWidth = gameConfig.gameConfig.boardCellWidth;
var tileHeight = gameConfig.gameConfig.boardCellHeight;

var boardWidth = gameConfig.boardState.initialWidth;
var boardHeight = gameConfig.boardState.initialHeight;

var firstSelected = gameConfig.gameConfig.initialColor;

// button to generate
var generateButton;

// =========================== CLASS INIT ========================

var TileDisplay = function(aDocument, level) {
    // init globals
    document = aDocument;

    // get the resources
    resources = require('../games/' + level + '/resources.js');

    // init generations and button
    generateButton = document.getElementById("generate_button");
    generations = resources.generations;
    initButtonText();

    // initialize main container
    initMainContainer();

    // add title
    initTileDisplay();

    // highlight initial one
    this.highlightCell(firstSelected);
};

module.exports = TileDisplay;

// ======================= INITIALIZATION ===============================

// Initialize the button initial text
function initButtonText() {
    generateButton.innerHTML = "Generate <br> (" + generations + ")";
}

// initialize the main container
function initMainContainer() {
    // get container from dom
    container = document.getElementById("tile_display");

    // calculate center margin and set attribute
    var size = ((tileWidth + 50) * numTiles) + 10;
    container.setAttribute('style', "overflow: hidden; width: " + size + "px; margin: auto;");

}

// create the tiles
function initTileDisplay() {
    for (var i = 0 ; i < numTiles; i++){
        // create new enclosing div
        var newDiv = document.createElement("div");
        newDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px;")

        // get the tile position (in tilemap)
        var tilePosition = (-1) * (i * tileWidth);

        // create the image
        var imageDiv = document.createElement("div");
        imageDiv.classList.add("tile-image");
        imageDiv.setAttribute('style', "background-position: top 0px left " + tilePosition + "px; float: left; display: inline-block;");

        // create the text
        var text = document.createElement("p");
        text.setAttribute('style', "text-align: center; margin-top: 6px;")
        
        // determine the value
        var resourceValue;

        if (resources.resources[i] != null)
            resourceValue = resources.resources[i];
        else
            resourceValue = 0;

        // add that resource value to the array and text
        text.innerHTML = resourceValue;
        numResources.push(resourceValue);

        // add to array
        mainDivs.push(newDiv);
        resourceText.push(text);

        // add that to the div
        newDiv.appendChild(imageDiv);
        newDiv.appendChild(text);

        container.appendChild(newDiv);
    }
}

// ================================= UNDO ==========================================

// move the game state to the undo
module.exports.saveGameState = function(){
    var savedState = 
    {
        numResources: cloneObject(numResources),
        generations: generations,
    }

    return savedState;
}

// recover the state to a prior game state
module.exports.recoverState = function(state) {
    // recover the state
    numResources = state.numResources;
    generations = state.generations;

    // update the display
    updateDisplay();

}

// clone a json object
function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj));
}

// Updates the display
function updateDisplay() {
    // update the resource display
    for (var i = 0 ; i < numResources.length; i++){
        var display = resourceText[i];
        var resourceCount = numResources[i];

        display.innerHTML = resourceCount;
    }

    // update the generations display() {
    generateButton.innerHTML = "Generate <br> (" + generations + ")";

    if (generations > 0)
        generateButton.disabled = false;
    else
        generateButton.disabled = true;
}

// ============================= SETTING ==================================

// select the cell at that location
TileDisplay.prototype.highlightCell = function(index) {
    // check out of bounds
    if (index > numTiles)
        return;

    // get the relevant div
    var toSelectDiv = mainDivs[index];

    // first deselect the currently highlighted cell
    if (currHighlighted != -1){
        // get the current div and update the style
        var currDiv = mainDivs[currHighlighted];
        currDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px;");
    }

    // then select the new div
    toSelectDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px; border-style: dotted; border-width: 2px");

    // update the current highlighted
    currHighlighted = index;
}

// ============== TILE RESOURCE ==============

// Consume resource
TileDisplay.prototype.consumeResource = function(index) {
    // do resource check
    if (numResources[index] <= 0)
        return false;

    // get the display
    var display = resourceText[index];

    // set and get resource value
    numResources[index]--;
    var currResourceCount = numResources[index];

    // set the display
    display.innerHTML = currResourceCount;

    return true;
}

// Refund resource
TileDisplay.prototype.refundResource = function(index) {
    // get the display
    var display = resourceText[index];

    // set and get resource value
    numResources[index]++;
    var currResourceCount = numResources[index];

    display.innerHTML = currResourceCount;

    return true;
}   

// Resoure check
TileDisplay.prototype.resourceCheck = function(index) {
    if (numResources[index] <= 0)
        return false;

    return true;
}

// =========== GENERATION RESOURCE ===========

// consume a generation
TileDisplay.prototype.consumeGeneration = function() {
    if (generations > 0){ 
        // consume a generation
        generations--;

        // set button text
        generateButton.innerHTML = "Generate <br> (" + generations + ")";

        // set button style if 0
        if (generations == 0){
            generateButton.disabled = true;
        }

        return true;
    } else {
        alert("stop changing the style you fuck");
        return false;
    }
}

TileDisplay.prototype.generationCheck = function() {
    if (generations > 0)
        return true;
    else
        return false;
}
