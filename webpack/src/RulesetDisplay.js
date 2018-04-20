// ============================ GLOBALS ==========================
var boundsX;
var boundsY;

var PIXI;
var app;

// current rule for testing purposes
var currRule = {
    points: [[0,0,1], [1,0,1], [2,0,1], [3,0,1]],
    generating: [[-1,0,1],[4,0,1]],
    width: 4,
    height: 1,
};

// cell width (relative to tileset)
var cellWidth = 32;
var cellHeight = 32;

// cell dimensions of the set
var actualWidth;
var actualHeight;

// cell dimensions of the entire board
var boardWidth = 15;
var boardHeight = 15;

// dimensions of the sprite
var spriteWidth = 16;
var spriteHeight = 16;

// tilemap init
var numTiles = 10;
var tileArray = new Array(numTiles);

var boardArr;

// =========================== CLASS INIT ========================

var RulesetDisplay = function(aBoundsX, aBoundsY, aPIXI) {
    // set globals
    boundsX = aBoundsX;
    boundsY = aBoundsY;
    PIXI = aPIXI;

    // Create the pixi applications
    app = new PIXI.Application({
        width: boundsX,
        height: boundsY,
        antialias: true,
        transparent: false,
        resolution: 1,
    });

    gameCreate();
};

module.exports = RulesetDisplay;

function gameCreate() {
    initializeBoardArray();
    initTiles();
    initEmptyTiles();
}

// ======================== LOGIC =======================================

// Initialize the tiles retrieved from the tilemap
// Store the rectangles in the image that we wish to retrieve
function initTiles () {
    // load the main texture sheet for the tileset.png
    texture = PIXI.loader.resources['./assets/tileset10.png'].texture;

    for (var i = 0 ; i < numTiles; i++){
        // create the rectangular cuts on the tilemaps
        var rectangle = new PIXI.Rectangle(i * cellWidth, 0, cellWidth, cellHeight);
        tileArray[i] = rectangle;    
    }
}


// initialize the board array
function initializeBoardArray() {
    // set the bounds to be two more for generating
    actualWidth = currRule.width + 2;
    actualHeight = currRule.height + 2;

    // create the array
    boardArr = new Array(actualWidth);
    for (var i = 0 ; i < actualWidth; i++)
        boardArr[i] = new Array(actualHeight);

    // init to zero
    for (var i = 0 ; i < actualWidth; i++){
        for (var j = 0 ; j < actualHeight; j++){
            boardArr[i][j] = 0;
        }
    }
}

// Initialize the board with the sprites
function initEmptyTiles () {
    // create a sprite for each tile (experimental)
    for (var i = 0 ; i < boardWidth; i++){
        for (var j = 0 ; j < boardHeight; j++){
            var newTile = createNewTileSprite(i, j, 0);
        }
    }
}

// Create a new tile sprite
function createNewTileSprite (x, y, tileCut) {
    // Use the tilemap cut that we want
    var newTexture = new PIXI.Texture(texture, tileArray[tileCut]);
    var sprite = new PIXI.Sprite.from(newTexture);

    // set the location
    sprite.x = (x * spriteWidth);
    sprite.y = (y * spriteHeight);

    // rescale
    sprite.width = spriteWidth;
    sprite.height = spriteHeight;

    // add that to the board
    app.stage.addChild(sprite);

    return sprite;
}

// ======================= GETTERS/SETTERS ===============================

// getter method for the app
RulesetDisplay.prototype.getApp = function() {
    return app;
}