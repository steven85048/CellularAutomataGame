var exports = module.exports = {};

exports.boardState = {
    initialWidth: 640,
    initialHeight: 640,
};

exports.gameConfig = {

    // cell grid dimensions
    boardCellCountWidth: 20,
    boardCellCountHeight: 20,
    
    // dimensions of each cell
    boardCellWidth: 32,
    boardCellHeight: 32,

    // offset of board
    offsetX: 0,
    offsetY: 0,

    // tileset configs
    numTiles: 6,
    initialColor: 1,
    zeroColor: 0,
    tileCutWidth: 32,
    tileCutHeight: 32,
};