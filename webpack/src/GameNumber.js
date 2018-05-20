/*
    Description: Singleton class containing which problem is currently in the game
*/

// current problem
module.exports.currGame = "level1";

// problem data
var ruleSet;
var resources;

// set the problem
module.exports.setProblem = function(aCurrProblem) {
    this.currGame = aCurrProblem;
}

module.exports.updateData = function() {
    // update the data
    ruleSet =  require('../games/' + this.currGame + '/ruleset.js');
    resources = require('../games/' + this.currGame + '/resources.js');
}

// Also have getters to ruleset/resources

module.exports.getRuleset = function() {
    this.updateData();
    return ruleSet;
}

module.exports.getResources = function() {
    this.updateData();
    return resources;
}

