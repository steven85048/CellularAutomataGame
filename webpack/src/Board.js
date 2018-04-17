/*
* Description: Main handler file for the board the board logic. Performs actios for the 
* (a) Tiling of the board
* (b) Coordinating of the disjoint set addition
*/

// ========================================================================================
// ======================================== GLOBALS =======================================
// ========================================================================================

var gameConfig = require('../configs/config.js');
var Logic = require('./Logic.js');

// Tile variables (for tilemap)
var numTiles = 5;
var tileArray = new Array(numTiles);

// Game logic object
var logic;

// Global tilemap texture
var texture;

// globals from config
var boardHeight = gameConfig.boardState.initialHeight;
var boardWidth = gameConfig.boardState.initialWidth;

var cellHeight = gameConfig.gameConfig.boardCellHeight;
var cellWidth = gameConfig.gameConfig.boardCellWidth;

var numCellsWidth = gameConfig.gameConfig.boardCellCountWidth;
var numCellsHeight = gameConfig.gameConfig.boardCellCountHeight;

var offsetMainX = gameConfig.gameConfig.offsetX;
var offsetMainY = gameConfig.gameConfig.offsetY;

// PIXI and app vars
var PIXI;
var app;

// ====================================== MAIN CLASS =====================================

// Create a class for the board
var Board = function(aPIXI, aApp) {
    // initialize variables
    PIXI = aPIXI;
    app = aApp;

    // Initialize the object with the game logic
    logic = new Logic();

    // initialize the cuts that are used from the tile map
    initTiles();

    // init empty tiles
    initEmptyTiles();
}

module.exports = Board;

// ======================================== BOARD INITIALIZATION ======================== 

// Initialize the board with the sprites
function initEmptyTiles () {
    // create a sprite for each tile (experimental)
    for (var i = 0 ; i < numCellsWidth; i++){
        for (var j = 0 ; j < numCellsHeight; j++){
            var newTile = createNewTileSprite(i, j, 4);
        }
    }
}

// Initialize the tiles retrieved from the tilemap
// Store the rectangles in the image that we wish to retrieve
function initTiles () {
    // load the main texture sheet for the tileset.png
    texture = PIXI.loader.resources['./assets/tileset.png'].texture;

    for (var i = 0 ; i < numTiles; i++){
        // create the rectangular cuts on the tilemaps
        var rectangle = new PIXI.Rectangle(i * cellWidth, 0, cellWidth, cellHeight);
        tileArray[i] = rectangle;    
    }
}


// ======================================== TILE CRUD ======================================

// Create a new tile sprite
function createNewTileSprite (x, y, tileCut) {
    // Use the tilemap cut that we want
    var newTexture = new PIXI.Texture(texture, tileArray[tileCut]);
    var sprite = new PIXI.Sprite.from(newTexture);

    // set the location
    sprite.x = offsetMainX + (x * cellWidth);
    sprite.y = offsetMainY + (y * cellHeight);

    // add the click listener for this boy
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointerup', tileClick);

    // add that to the board
    app.stage.addChild(sprite);
}

// ===================================== TILE EVENT LISTENERS =====================================

// Event listener whenver button is clicked
function tileClick () {
    // register that tile in the logic class
    logic.addNewCell(this.x / cellWidth, this.y / cellWidth, 1);
    logic.disjointSetMatch();

    var newTexture = new PIXI.Texture(texture, tileArray[1]);
    this.texture = newTexture;
}