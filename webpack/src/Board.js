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

// Sprite array
var spriteArray;

// Current color of the user
var currColor = 1;

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
    // first initialize the sprite container
    spriteArray = new Array(numCellsWidth);

    for (var i = 0 ; i < numCellsWidth; i++)
        spriteArray[i] = new Array(numCellsHeight);

    // create a sprite for each tile (experimental)
    for (var i = 0 ; i < numCellsWidth; i++){
        for (var j = 0 ; j < numCellsHeight; j++){
            var newTile = createNewTileSprite(i, j, 4);
            spriteArray[i][j] = newTile;
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

    return sprite;
}

// Change a tile color
function addTile(x, y, color) {
    // change the texture of the sprite
    var newTexture = new PIXI.Texture(texture, tileArray[color]);
    spriteArray[x][y].texture = newTexture;

    // then add that tile in the logic class
    logic.addNewCell(x, y, color);
    var match = logic.disjointSetMatchRecent();

    if (match != false){
        var corner = logic.lookupCorner(x, y);
        generateAdditionalCells(match, corner[0], corner[1]);
    }
}

// Generate additional cells based on the rules
function generateAdditionalCells(match, x, y){
    for (var i = 0 ; i < match.length; i++){
        addTile(x + match[i][0], y + match[i][1], match[i][2]);
    }
}

// ===================================== TILE EVENT LISTENERS =====================================

// Event listener whenver button is clicked
function tileClick () {
    // extract the x and y grid coordinates
    var xCoord = this.x / cellWidth
    var yCoord =  this.y / cellHeight;

    // add the tile
    addTile(xCoord, yCoord, currColor);
}