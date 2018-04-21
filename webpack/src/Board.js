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

var tileDisplay;

// Tile variables (for tilemap)
var numTiles = gameConfig.gameConfig.numTiles;
var tileArray = new Array(numTiles);
var emptyTile = gameConfig.gameConfig.zeroColor;

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
var currColor = gameConfig.gameConfig.initialColor;

// Map of point (x,y) to filter
var blurMap = [];

// counter used for blurring
var blurCounter = 0;

// ====================================== MAIN CLASS =====================================

// Create a class for the board
var Board = function(aPIXI, aApp, aTileDisplay) {
    // initialize variables
    PIXI = aPIXI;
    app = aApp;
    tileDisplay = aTileDisplay;

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
            var newTile = createNewTileSprite(i, j, emptyTile);
            spriteArray[i][j] = newTile;
        }
    }
}

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
function addTile(x, y, color, additional) {
    // first do a resource check
    if (!tileDisplay.resourceCheck(color) && !additional)
        return;

    // then add that tile in the logic class
    var ret = logic.addNewCell(x, y, color);

    // if the color is the same ignore
    if (ret == 3)
        return;

    // reset the filters (to make all of them flash concurrently)
    resetBlurMap();

    // get the generating cells (matches)
    var matches = logic.getMatches();

    //console.log(matches);

    // loop through matches and get generating arrays
    for (var i = 0 ; i < matches.length; i++){
        var disjointSet = matches[i][0];
        var genArray = matches[i][1];
        
        // get the relative corner of the set
        var corner = disjointSet.bounds[0];

        // loop through generating array and add those to the blur list
        for (var j = 0 ; j < genArray.length; j++){
            var currPoint = genArray[j];

            // account for offset
            var actualX = corner[0] + currPoint[0];
            var actualY = corner[1] + currPoint[1];

            // set the filter
            var blurFilter = new PIXI.filters.BlurFilter();
            spriteArray[actualX][actualY].filters = [blurFilter];
            blurMap[[actualX, actualY]] = blurFilter;
        }
    }

    // only consume/refund if not a generating cell
    if (!additional){
        // decrement resource value
        // if the resource count is below zero, ignore
        tileDisplay.consumeResource(color);

        // refund the cell if placing a 0
        if (ret == 1)
            tileDisplay.refundResource(logic.getLastColorDeleted());
    }

    // change the texture of the sprite
    var newTexture = new PIXI.Texture(texture, tileArray[color]);
    spriteArray[x][y].texture = newTexture;    
}

// ======================================== BLUR FILTERS =========================================

// empties the current blur map (and filters)
function resetBlurMap() {
    // reset all the textures of the current blur map
    for (key in blurMap){
        if (blurMap.hasOwnProperty(key)){
            // get the sprite
            var currSprite = spriteArray[key[0]][key[1]];
            
            // set the blur to 0
            blurMap[key].blur = 0;

            // set the sprite filter to empty
            currSprite.filter = null;
        }
    }

    blurMap = {};
}

// runs at a quick interval
Board.prototype.renderBlur = function() {
    blurCounter += .03;

    // loop through the filters
    for (key in blurMap) {
        if (blurMap.hasOwnProperty(key)) {
            // get the filter
            var currBlurFilter = blurMap[key];
            currBlurFilter.blur = 5 * (Math.cos(blurCounter));
        }
    }
}

// =================================== GENERATE THE CELLS ========================================

// generate the cells that are matched
Board.prototype.generateCells = function() {
    var matches = logic.getMatches();
    var matchPoints = [];

    console.log("generating");

    // cell generation
    for (var i = 0 ; i < matches.length; i++){
        var match = matches[i][1];
        var corner = matches[i][0].bounds[0];

        console.log(match);

        // check if no match
        if (match == null || corner == null)
            continue;

        // don't want to add them as they go since want to add (ALL) the disjoint sets at once, so store them in an intermediate array
        for (var j = 0 ; j < match.length; j++) {
            matchPoints.push([match[j][0] + corner[0], match[j][1] + corner[1], match[j][2]])
        }
    }

    // add all the generated cells
    for (var i = 0 ; i < matchPoints.length; i++)
        addTile(matchPoints[i][0], matchPoints[i][1], matchPoints[i][2], true);
}

// ===================================== TILE EVENT LISTENERS =====================================

// Event listener whenver button is clicked
function tileClick () {
    // extract the x and y grid coordinates
    var xCoord = this.x / cellWidth
    var yCoord =  this.y / cellHeight;

    // add the tile
    addTile(xCoord, yCoord, currColor, false);
}

// Change the color of the tile
Board.prototype.changeColor = function (color) {
    currColor = color;
}