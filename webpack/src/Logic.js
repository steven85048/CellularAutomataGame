/*
*   Description: Handles the disjoint set basic functions as well as the matching with the dictionary DFA
*/

// Dependencies
var _ = require('underscore');

// get the config
var gameConfig = require('../configs/config.js');

// DFA and object
var DFA = require('./DFA.js');
var dfa;

var boardWidth = gameConfig.gameConfig.boardCellCountWidth;
var boardHeight = gameConfig.gameConfig.boardCellCountHeight;

var zeroColor = gameConfig.gameConfig.zeroColor;

// last color deleted
var lastColorDeleted;

// 2D container to hold the board state
var board;

//Disjoint set global structs
/*
    Note: the disjointSet struct is as such:
    {
        bounds: [[x, y, color], width, height],
        members: [[x,y,color]]
    }
*/

var lookup = {}; 

// current disjoint set matches
var matches = [];

// ==================================== CLASS SETUP =========================================

var Logic = function() {
    // initialize the board array (all empty at first)
    initBoardArray();

    // initialize the DFA
    dfa = new DFA();
}

module.exports = Logic;

// ============================== INITIALIZATION =============================================

// Initialize the Array that will store the map with the states
function initBoardArray () {
    // NOTE: coordinates referenced with (width, height) 
    board = new Array(boardWidth);
    for(var i = 0 ; i < boardWidth; i++){
        board[i] = new Array(boardHeight);
    }

    // initialize the initial board state (all zero - empty)
    for (var i = 0 ; i < boardWidth; i++){
        for (var j = 0 ; j < boardHeight; j++){
            board[i][j] = 0;
        }
    }
}

// ================================== DISJOINT SET CRUD ======================================

// Logic after a cell has been changed from a nonzero color to zero [Bad runtime]
Logic.prototype.deleteCell = function(x, y) {
    // set the board color as empty
    board[x][y] = 0;

    // first lookup the disjoint set
    var disjointSet = lookup[[x,y]];

    // check if nonzero
    if (disjointSet == null)
        return;

    // delete if match exists
    spliceDisjointSet(matches, disjointSet);
    
    // readd each point except for the deleted point
    var points = disjointSet.members;

    // reset the lookup for these points
    for (var i = 0 ; i < points.length; i++){
        delete lookup[[points[i][0], points[i][1]]];
        board[points[i][0]][points[i][1]] = 0;
    }

    // then readd all of them (excluding the previous point)
    for (var i = 0 ; i < points.length; i++){
        if ((points[i][0] != x) || (points[i][1] != y)){
            this.addNewCell(points[i][0], points[i][1], points[i][2]);
        }
    }
}

// Update cell color (from nonzero to another color (not zero))
Logic.prototype.updateCell = function(x, y, color){
    // set the board color
    board[x][y] = color;

    // first lookup the disjoint set
    var disjointSet = lookup[[x,y]];

    // remove that set from matches
    spliceDisjointSet(matches, disjointSet);

    // then find the point and update the color
    for (var i = 0 ; i < disjointSet.members.length; i++){
        // find the thing and update color
        if (disjointSet.members[i][0] == x && disjointSet.members[i][1] == y){
            disjointSet.members[i][2] = color;
            break;
        }
    }

    // pass that newly added set to DFA and match if yes
    var match = dfa.passInput(disjointSet);

    if (match != false){
        matches.push([disjointSet, match]);
    }

}

// Logic after new cell has been inputted to board
Logic.prototype.addNewCell = function(x, y, color){
    // if the x and y already exist then just delete
    if (lookup[[x, y]] && color == zeroColor){
        lastColorDeleted = board[x][y];
        this.deleteCell(x, y);
        return 1;
    }
    // if the cell needs to be different 
    else if (lookup[[x,y]] && board[x][y] != color){
        this.updateCell(x,y,color);
        return 2;
    } 
    // ignore if the colors are the same
    else if (board[x][y] == color){ 
        return 3;
    }

    // first set the array object
    board[x][y] = color;
    var point = [x, y, color];

    // get the cells in four directions (left, up, right, down)
    var dirs = getCardinalDirectionCells(x, y);

    // get all the relevant disjoint sets
    var cardinalSets = [];

    var dirHash = {};
    var changed = false;
    for (var i = 0 ; i < dirs.length; i++){
        // add all the disjoint sets that are in the cardinal direction
        if (dirs[i] != 0){
            changed = true;

            var currSet = lookup[[dirs[i][0], dirs[i][1]]];

            // lookup the set and push to the set (if not added yet)
            if (!dirHash[currSet.bounds[0]]){

                cardinalSets.push(currSet);
                dirHash[currSet.bounds[0]] = true;

                // remove the neighboring disjoint set
                spliceDisjointSet(matches, currSet);
            }
        }
    }

    // create new disjoint set of just the new point
    var newDisjointSet = 
    {
        bounds: [point, 0, 0],
        members: [point],
    }

    // only do union if there are neighbors to union
    if (changed) { // otherwise we need to union all of the sets

        // bound maximization problem: want to find the largest rectangle after unioning all sets
        var upperLeft = point;
        var bottomRight = point;

        // loop through all four or less disjoint sets
        for (var i = 0 ; i < cardinalSets.length; i++){
            // get the updated bounds
            var currUpperLeft = cardinalSets[i].bounds[0];
            var currBottomRight = [currUpperLeft[0] + cardinalSets[i].bounds[1], currUpperLeft[1] + cardinalSets[i].bounds[2]];

            // update the bounds
            upperLeft = [Math.min(currUpperLeft[0], upperLeft[0]), Math.min(currUpperLeft[1], upperLeft[1])];
            bottomRight = [Math.max(currBottomRight[0], bottomRight[0]), Math.max(currBottomRight[1], bottomRight[1])];

            // add all the members of this disjoint set to the new one as well update that point's lookup
            for (var j = 0 ; j < cardinalSets[i].members.length; j++){
                var currPoint = cardinalSets[i].members[j];

                // add member
                newDisjointSet.members.push(currPoint);

                // update lookup 
                lookup[[currPoint[0], currPoint[1]]] = newDisjointSet;
            }
        }

        // set the newDisjointSet parameters
        newDisjointSet.bounds = [upperLeft, bottomRight[0] - upperLeft[0], bottomRight[1] - upperLeft[1]];        

    }

    // add to lookup
    lookup[[point[0], point[1]]] = newDisjointSet;

    // pass that newly added set to DFA and match if yes
    var match = dfa.passInput(newDisjointSet);

    if (match != false){
        matches.push([newDisjointSet, match]);
    }

    // if a normal add return 0
    return 0;
}

// remove the disjoint set from the set of all sets if equal 
function spliceDisjointSet(totalSet, disjointSet){
    // also remove this disjoint set from the running disjointSets
    for (var j = 0 ; j < totalSet.length; j++){
        if (_.isEqual(totalSet[j][0], disjointSet)){
            totalSet.splice(j, 1);
            break;
        }
    }
}


// get the cells in four directions
function getCardinalDirectionCells (x, y) {
    // left, up, right, down
    var dirs = new Array(4);

    // initialize with 0
    for (var i = 0 ; i < dirs.length; i++) 
        dirs[i] = 0;

    // left
    if (y != 0 && board[x][y-1] != 0)
        dirs[0] = [x, y-1, board[x][y-1]];

    // up
    if (x != 0 && board[x-1][y] != 0)
        dirs[1] = [x-1, y, board[x-1][y]];

    // right
    if (y != (boardWidth - 1) && board[x][y+1] != 0)
        dirs[2] = [x, y+1, board[x][y+1]];

    // down
    if (x != (boardHeight - 1) && board[x+1][y] != 0)
        dirs[3] = [x+1, y, board[x + 1][y]];

    return dirs;
}

// ================================= UNDO ==========================================

// move the game state to the undo
module.exports.saveGameState = function(){

    // first clone the board
    var newBoard = [];
    
    for (var i = 0 ; i < board.length; i++){
        newBoard[i] = board[i].slice();
    }

    var savedState = 
    {
        lookup: cloneObject(lookup),
        board: newBoard,
        matches: cloneObject(matches),
        lastColorDeleted: lastColorDeleted,
    }

    return savedState;
}

// recover the state to a prior game state
module.exports.recoverState = function(state) {
    // recover the state
    lookup = state.lookup;
    board = state.board;
    matches = state.matches;
    lastColorDeleted = state.lastColorDeleted;
}

// clone a json object
function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj));
}

// =================================== GETTER SETTER ================================

// returns the corner for a (x,y) coordinate position
Logic.prototype.lookupCorner = function(x, y){
    var dSet = lookup[[x,y]];
    if (dSet)
        return dSet.bounds[0];
    else
        return 0;
}

Logic.prototype.getLastColorDeleted = function() {
    return lastColorDeleted;
}

Logic.prototype.getMatches = function() {
    return matches;
}

Logic.prototype.getBoard = function() {
    return board;
}
