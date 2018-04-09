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

var focusedObject;
var board;

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// BEFORE THE GAME IS LOADED
function preload () {

    // LOAD THE RELEVANT RESOURCES
    game.load.image('sky', './assets/sky.png');
    game.load.image('dude', './assets/dude.png');
    game.load.image('star', './assets/star.png');

    // CONFIGURE THE GAME SCALING
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // CONFIGURE INITIAL GAME STYLES
    game.stage.backgroundColor = '#eee';
}

// CREATE THE INITIAL GAME STATE
function create () {
    // get height and width from the config 
    var boardHeight = gameConfig.gameConfig.boardCellHeight;
    var boardWidth = gameConfig.gameConfig.boardCellWidth;

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

    focusedObject = game.add.sprite(50, 50, 'star');
}

// UPDATE FUNCTION CONTINUALLY RUNS IN BACKGROUND
function update () {
    focusedObject.x += 1;
    focusedObject.y += 1;
}