// ===============================================================================
// ========================= CONFIG SETUP ============ ===========================
// ===============================================================================

var gameConfig = {};

// synchronous config retrieval: (jQuery)
$.ajax({
    url: '/getGameConfig',
    success: function (result) {
        if (result.isOk == false) alert(result.message);
        gameConfig = result;
    },
    async: false,
})

// ===============================================================================
// ========================= GAME VAR CONFIGURATION == ===========================
// ===============================================================================

var game = new Phaser.Game(gameConfig.boardState.initialWidth, gameConfig.boardState.intiialHeight, Phaser.AUTO, null, {preload: preload, create: create, update: update});

// ===============================================================================
// ========================= GAME GLOBAL VARIABLES ===============================
// ===============================================================================

// game config vars
var boardHeight;
var boardWidth;
var cellHeight;
var cellWidth;

// game state vars
var board;
var selectedCellState; // state of the cell the user is currently grabbing

// ============================ TILEMAP VARIABLES ==============================

// tilesets and layers
var map;
var mainLayer;

// marker variable for highlighting selected cell
var marker;

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// BEFORE THE GAME IS LOADED
function preload () {

    // LOAD THE RELEVANT RESOURCES
    game.load.image('sky', './assets/sky.png');
    game.load.image('dude', './assets/dude.png');
    game.load.image('star', './assets/star.png');
    game.load.image('tileset', './assets/tileset.png');

    // CONFIGURE THE GAME SCALING
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // CONFIGURE INITIAL GAME STYLES
    game.stage.backgroundColor = '#2b2b2b';
}

// CREATE THE INITIAL GAME STATE
function create () {

    // get height and width from the config 
    boardHeight = gameConfig.gameConfig.boardCellCountHeight;
    boardWidth = gameConfig.gameConfig.boardCellCountWidth;

    cellHeight = gameConfig.gameConfig.boardCellHeight;
    cellWidth = gameConfig.gameConfig.boardCellWidth;

    // =========================== Initialize the array containing the board state ===================

    // NOTE: coordinates referenced with (height, width) or (y, x);
    board = new Array(boardHeight);
    for(var i = 0 ; i < boardHeight; i++){
        board[i] = new Array(boardWidth);
    }

    // initialize the initial board state (all zero - empty)
    for (var i = 0 ; i < boardHeight; i++){
        for (var j = 0 ; j < boardWidth; j++){
            board[i][j] = 0;
        }
    }

    // ========================== Tilemap Initialization =============================================

    // initialize map to an empty tilemap that uses the tileset image for the tiles
    map = game.add.tilemap();
    map.addTilesetImage('tileset');

    // create main layer
    // Configuration (current): 150x150 cells of 10x10 pixels
    mainLayer = map.create('mainLayer', boardWidth, boardHeight, cellWidth, cellHeight);
    mainLayer.scrollFactorX = 0.5;
    mainLayer.scrollFactorY = 0.5;

    mainLayer.resizeWorld();

    // create the styling for the marker
    // the marker highlights the cell that the user is currently on
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, cellWidth, cellHeight);

    // add event listener for whenever the user clicks a cell on the graph
    game.input.addMoveCallback(inputEvent, this);
}

// UPDATE FUNCTION CONTINUALLY RUNS IN BACKGROUND
function update () {}

// ===============================================================================
// ========================= METHODS FOR TILE SELECTING ==========================
// ===============================================================================

// This method is called whenever any screen event (click, move) occurs
function inputEvent() {
    // update the marker location (black rectangular highlight)
    marker.x = mainLayer.getTileX(game.input.activePointer.worldX) * cellWidth;
    marker.y = mainLayer.getTileY(game.input.activePointer.worldY) * cellHeight;

    console.log(marker.x + "  " + marker.y);

    // handle whenever the user explicitly clicks on a board cell
    if (game.input.mousePointer.isDown){
        // mark the board that something has been selected

        map.putTile(5, mainLayer.getTileX(marker.x), mainLayer.getTileY(marker.y), mainLayer);
    }
}

