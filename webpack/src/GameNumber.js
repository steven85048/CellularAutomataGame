/*
    Description: Singleton class containing which problem is currently in the game
*/

// current problem
module.exports.currGame = "level2";

// set the problem
module.exports.setProblem = function(aCurrProblem) {
    this.currGame = aCurrProblem;
}