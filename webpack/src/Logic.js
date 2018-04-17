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
var disjointSets = [];
var lookup = {}; 

// keep track of most recent disjoint set added
var mostRecent;

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

// Logic after new cell has been inputted to board
Logic.prototype.addNewCell = function(x, y, color){
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

                // also remove this disjoint set from the running disjointSets
                for (var j = 0 ; j < disjointSets.length; j++){
                    if (_.isEqual(disjointSets[j], currSet)){
                        disjointSets.splice(j, 1);
                        break;
                    }
                }
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

        // debugging
        //console.log("New corner: " + newDisjointSet.bounds[0][0] + "   " + newDisjointSet.bounds[0][1] + "\n");
    }

    // add the disjoint set, add to lookup, then set most recent
    disjointSets.push(newDisjointSet);
    lookup[[point[0], point[1]]] = newDisjointSet;
    mostRecent = newDisjointSet;

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

// =================================== GETTER SETTER ================================

// returns the corner for a (x,y) coordinate position
Logic.prototype.lookupCorner = function(x, y){
    var dSet = lookup[[x,y]];
    return dSet.bounds[0];
}

// ======================================= DFA PASSAGE ==============================

// pass the disjoint sets (all) through the DFA
Logic.prototype.disjointSetMatchAll = function() {
    // loop through the disjoint sets
    for (var i = 0 ; i < disjointSets.length; i++){
        var currSet = disjointSets[i];
        dfa.passInput(currSet);
    }
}

// pass a single disjoint set through the DFA
Logic.prototype.disjointSetMatchRecent = function() {
    return dfa.passInput(mostRecent);
}

// pass that disjoint set through the dfa
function disjointSetPass(disjointSet) {
   return dfa.passInput(disjointSet);
}