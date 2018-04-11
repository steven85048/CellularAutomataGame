// ===============================================================================
// ========================= GAME STATICS ========================================
// ===============================================================================

// Main PIXIJS app variable
var app;

// sizes
var boardHeight;
var boardWidth;
var cellHeight;
var cellWidth;

// pixiJS aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    Rectangle = PIXI.Rectangle;

var graphics = new PIXI.Graphics();

// tilemap texture
var texture;

// ===============================================================================
// ========================= CONFIG SETUP ========================================
// ===============================================================================

var gameConfig = {};

// synchronous config retrieval: (jQuery)
$.ajax({
    url: '/getGameConfig',
    success: function (result) {
        // error handling
        if (result.isOk == false) alert(result.message);

        // set the globals based on this received config
        gameConfig = result;
        initGlobals(gameConfig);

        // Start the pixi application based on the game config
        app = new Application({
            width: boardWidth,
            height: boardHeight,
            antialias: true,
            transparent: false,
            resolution: 1
        });

        // append the canvas of app
        document.body.appendChild(app.view);

        // after the configuration is loaded, load the content the game needs
        loadAssets();
    },
    async: false,
})

// Extract the globals from the config data retrieved from server
function initGlobals(config) {
    boardHeight = gameConfig.boardState.initialHeight;
    boardWidth = gameConfig.boardState.initialWidth;

    cellHeight = gameConfig.gameConfig.boardCellHeight;
    cellWidth = gameConfig.gameConfig.boardCellWidth;
}

// ===============================================================================
// ========================= MAIN EVENT THREAD METHODS ===========================
// ===============================================================================

// ========================= GAME VARIABLES ======================================

// Mouse position
var mousePosition = new Array(2);

// Tile variables
var numTiles = 5;
var tileArray = new Array(numTiles);

// Offset for the main board
var offsetMainX = 0;
var offsetMainY = 0;

// Board Array
var board;

// ============================ GAME LOADING FUNCTIONS ===========================

// load the content that the application needs to run
function loadAssets() {
    PIXI.loader
        .add([
            "./assets/star.png",
            "./assets/t0.png",
            "./assets/tileset.png",
        ])
        .load(gameCreate);
}

// Initialization of the first game state and the first draw of the map
function gameCreate() {
    // initialize the cuts that are used from the tile map
    initTiles();

    // init the board array
    initBoardArray();

    // init the marker for the board
    initMarker();

    // init the app timer
    app.ticker.add(delta => gameLoop(delta));

}

// Initialize the tiles retrieved from the tilemap
// Store the rectangles in the image that we wish to retrieve
function initTiles() {
    // load the main texture sheet for the tileset.png
    texture = resources['./assets/tileset.png'].texture;

    for (var i = 0 ; i < numTiles; i++){
        // create the rectangular cuts on the tilemaps
        var rectangle = new Rectangle(i * cellWidth, 0, cellWidth, cellHeight);
        tileArray[i] = rectangle;    

        // Example usage
        /*
        var texture = new PIXI.Texture(texture, tileArray[i]);
        var sprite = new PIXI.Sprite.from(texture);

        sprite.x = i * cellWidth;
        sprite.y = 0;

        app.stage.addChild(sprite);
        */
    }

}

// Initialize the Array that will store the map with the states
function initBoardArray() {
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
}

// Initialize the marker highlight that appears when the user hovers or clicks on a cell
function initMarker() {
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawRect(0 + offsetMainX,0 + offsetMainY,cellWidth, cellHeight);

    app.stage.addChild(graphics);
}

// The constantly ticking game loop (60 times per second)
function gameLoop(delta){
    // get mouse position
    var global = app.renderer.plugins.interaction.mouse.global;

    mousePosition[0] = global.x;
    mousePosition[1] = global.y;

    // get the grid coordinates
    var gridX = Math.floor((mousePosition[0] + offsetMainX)/cellWidth);
    var gridY = Math.floor((mousePosition[1] + offsetMainY)/cellHeight);

    // draw the updated marker position
    var markerX = gridX * cellWidth;
    var markerY = gridY * cellHeight;

    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawRect(markerX, markerY , cellWidth, cellHeight);

    app.stage.addChild(graphics);


}