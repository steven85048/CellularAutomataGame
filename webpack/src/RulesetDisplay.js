// ============================ GLOBALS ==========================
var PIXI;

var gameConfig = require('../configs/config.js');

// current rule for testing purposes
var currRule;

// cell width (relative to tileset)
var cellWidth = gameConfig.gameConfig.tileCutWidth;
var cellHeight = gameConfig.gameConfig.tileCutHeight;

// tilemap init
var numTiles = gameConfig.gameConfig.numTiles;
var tileArray = new Array(numTiles);

// array of colors
var boardArr;
var spriteArr;

// texture
var texture;

// =========================== CLASS INIT ========================

var RulesetDisplay = function(aPIXI, aRule, aSpriteWidth, aSpriteHeight) {    
    // set globals
    PIXI = aPIXI;
    this.currRule = aRule;

    // set the bounds to be two more for generating
    this.boardWidth = this.currRule.width + 2;
    this.boardHeight = this.currRule.height + 2;

    // set the sprite 
    this.spriteWidth = aSpriteWidth;
    this.spriteHeight = aSpriteHeight;

    // create global arrays
    RulesetDisplay.prototype.boardArr;
    RulesetDisplay.prototype.spriteArr;

    // store the sprites of the generating cells (and their blurring)
    this.generatingCells = [];
    this.blurFilters = [];

    // counter for ticker
    this.counter = 0;

    // Create the pixi applications
    this.app = new PIXI.Application({
        width: this.boardWidth * this.spriteWidth,
        height: this.boardHeight * this.spriteHeight,
        antialias: true,
        transparent: false,
        resolution: 1,
    });

    this.gameCreate();
};

module.exports = RulesetDisplay;

RulesetDisplay.prototype.gameCreate = function() {
    // Initialize things again
    this.initializeBoardArray();
    this.initTiles();
    this.initEmptyTiles();
    this.initRuleTiles();

    // add a ticker for animating generating cells - pixijs does some bullshit binding if not like this
    this.app.ticker.add(function(delta) {
        this.animate(delta);
    }.bind(this));
    
}

// ======================== LOGIC =======================================

// Initialize the tiles according to the rules
RulesetDisplay.prototype.initRuleTiles = function() {

    // add normal points
    for (var i = 0 ; i < this.currRule.points.length; i++){
        var currPoint = this.currRule.points[i];

        // extract the data
        var pointX = currPoint[0] + 1;
        var pointY = currPoint[1] + 1;
        var pointColor = currPoint[2];

        // change the texture of the sprite
        var newTexture = new PIXI.Texture(texture, tileArray[pointColor]);
        this.spriteArr[pointX][pointY].texture = newTexture; 
    }

    // then add generating points
    for (var i = 0 ; i < this.currRule.generating.length; i++){
        var currPoint = this.currRule.generating[i];

        // extract the data
        var pointX = currPoint[0] + 1;
        var pointY = currPoint[1] + 1;
        var pointColor = currPoint[2];

        // current sprite
        var currSprite = this.spriteArr[pointX][pointY];

        // add blur filter
        var blurFilter = new PIXI.filters.BlurFilter();
        currSprite.filters = [blurFilter];
        this.blurFilters.push(blurFilter);

        // add to the generating array
        this.generatingCells.push(currSprite);

        // change the texture of the sprite
        var newTexture = new PIXI.Texture(texture, tileArray[pointColor]);
        currSprite.texture = newTexture; 
    }
}

// Initialize the tiles retrieved from the tilemap
// Store the rectangles in the image that we wish to retrieve
RulesetDisplay.prototype.initTiles  = function() {
    // load the main texture sheet for the tileset.png
    texture = PIXI.loader.resources['./assets/tileset10.png'].texture;

    for (var i = 0 ; i < numTiles; i++){
        // create the rectangular cuts on the tilemaps
        var rectangle = new PIXI.Rectangle(i * cellWidth, 0, cellWidth, cellHeight);
        tileArray[i] = rectangle;    
    }
}


// initialize the board array
RulesetDisplay.prototype.initializeBoardArray = function() {
    // create the array
    this.boardArr = new Array(this.boardWidth);
    this.spriteArr = new Array(this.boardWidth);

    for (var i = 0 ; i < this.boardWidth; i++){
        this.boardArr[i] = new Array(this.boardHeight);
        this.spriteArr[i] = new Array(this.boardHeight);
    }

    // init to zero
    for (var i = 0 ; i < this.boardWidth; i++){
        for (var j = 0 ; j < this.boardHeight; j++){
            this.boardArr[i][j] = 0;
        }
    }
}

// Initialize the board with the sprites
RulesetDisplay.prototype.initEmptyTiles = function() {
    // create a sprite for each tile (experimental)
    for (var i = 0 ; i < this.boardWidth; i++){
        for (var j = 0 ; j < this.boardHeight; j++){
            var newTile = this.createNewTileSprite(i, j, 0);
            this.spriteArr[i][j] = newTile;
        }
    }
}

// Create a new tile sprite
RulesetDisplay.prototype.createNewTileSprite  = function(x, y, tileCut) {
    // Use the tilemap cut that we want
    var newTexture = new PIXI.Texture(texture, tileArray[tileCut]);
    var sprite = new PIXI.Sprite.from(newTexture);

    // set the location
    sprite.x = (x * this.spriteWidth);
    sprite.y = (y * this.spriteHeight);

    // rescale
    sprite.width = this.spriteWidth;
    sprite.height = this.spriteHeight;

    // add that to the board
    this.app.stage.addChild(sprite);

    return sprite;
}

// ====================== ANIMATE =======================================

// run this at an interval
RulesetDisplay.prototype.animate = function (delta) {
    this.counter += 0.03;

    // rotate the generating cells
    for (var i = 0 ; i < this.blurFilters.length; i++){
        this.blurFilters[i].blur = 5 * (Math.cos(this.counter));
    }
}

// ======================= GETTERS/SETTERS ===============================

// getter method for the app
RulesetDisplay.prototype.getApp = function() {
    return this.app;
}