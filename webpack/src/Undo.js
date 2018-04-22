// Get the instances of the current classes
var logic = require('./Logic.js');
var board = require('./Board.js');
var tileDisplay = require('./TileDisplay.js');

// Create a stack 
module.exports.memoryStack = new Array();

// Push memory to the stack
module.exports.pushMemory = function(){
    // for some reason we need to do another require here but whatever
    board = require('./Board.js');

    // get the current game state
    var a = logic.saveGameState();
    var b = board.saveGameState();
    var c = tileDisplay.saveGameState();

    // place the game state into a tuple
    var state = [a,b,c];

    // push to stack
    this.memoryStack.push(state);
}

// Pop memory from the stack
module.exports.popMemory = function() {
    // pop the top
    if (this.memoryStack.length > 0)
        var stackTop = this.memoryStack.pop();

    // undo!
    logic.recoverState(stackTop[0]);
    board.recoverState(stackTop[1]);
    tileDisplay.recoverState(stackTop[2]);
}