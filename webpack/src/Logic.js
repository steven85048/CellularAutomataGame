/*
*   Description: Handles the disjoint set basic functions as well as the matching with the dictionary DFA
*/

// get the config
var gameConfig = require('../configs/config.js');

var numCellsWidth = gameConfig.gameConfig.boardCellCountWidth;
var numCellsHeight = gameConfig.gameConfig.boardCellCountHeight;

// 2D container to hold the board state
var board;

// Disjoint set global structs
var disjointSets = [];
var lookup; 

// ==================================== CLASS SETUP =========================================

var Logic = function() {
    // initialize the board array (all empty at first)
    initBoardArray();
}

module.exports = Logic;

// ============================== INITIALIZATION =============================================

// Initialize the Array that will store the map with the states
function initBoardArray () {
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

// ================================== DISJOINT SET CRUD ======================================

// Logic after new cell has been inputted to board
Logic.prototype.addNewCell = function(x, y, color){
    // first set the array object
    board[x][y] = color;
    var point = [x,y];

    // get the cells in four directions (left, up, right, down)
    var dirs = getCardinalDirectionCells(x, y);

    // get all the relevant disjoint sets
    var cardinalSets = [];

    var changed = false;
    for (var i = 0 ; i < dirs.length; i++){
        // add all the disjoint sets that are in the cardinal direction
        if (dirs[i] != 0){
            changed = true;

            var currSet = lookup[dirs[i][0], dirs[i][1]];
            cardinalSets.push(currSet);
        }
    }

    // create new disjoint set of just the new point
    var newDisjointSet = 
    {
        bounds: [point, 0, 0],
        members: [point],
    }

    // easiest case: if all four cells in cardinal direction are empty, then create new disjoint set
    if (!changed){
        // then add it to set as well as set lookup
        disjointSets.push(newDisjointSet);
        lookup[point] = newDisjointSet;
    } else { // otherwise we need to union all of the sets

        // bound maximization problem: want to find the largest rectangle after unioning all sets
        var upperLeft = point;
        var bottomRight = point;

        // loop through all four or less disjoint sets
        for (var i = 0 ; i < cardinalSets.length; i++){
            // get the updated bounds
            var currUpperLeft = cardinalSets[i].bounds[0];
            var currBottomRight = [currUpperLeft[0] + cardinalSets[i].bounds[1], currUpperLeft[1] + cardinalSets[i].bounds[2]];


        }

    }

}

// get the cells in four directions
function getCardinalDirectionCells (x, y) {
    // left, up, right, down
    var dirs = new Array(4);

    // left
    if (y == 0)
        dirs[0] = 0;
    else
        dirs[0] = [x, y-1, board[x][y-1]];

    // up
    if (x == 0)
        dirs[1] = 0;
    else
        dirs[1] = [x-1, y, board[x-1][y]];

    // right
    if (y == boardWidth - 1)
        dirs[2] = 0;
    else
        dirs[2] = [x, y+1, board[x][y+1]];

    // down
    if (x == boardHeight == 1)
        dirs[3] = 0;
    else
        dirs[3] = [x+1, y, board[x + 1][y]];

    return dirs;
}