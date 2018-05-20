/*
    Description: Singleton class containing which problem is currently in the game
*/
// json object of all levels
var levels = require('../games/levels.js');

// add the width/heights to the levels
function addRuleParams() {
    for (var key in levels) {
        if (levels.hasOwnProperty(key)) {
            var levelData = levels[key].ruleset;

            // first update the accepting nodes
            var maxAccepting = extractMaxDimensions(levelData.accepting_rule[0].points);
            levelData.accepting_rule[0]["width"] = maxAccepting[0];
            levelData.accepting_rule[0]["height"] = maxAccepting[1];

            // then update the subrule nodes
            for (var i = 0 ; i < levelData.rules.length; i++){
                var currRule = levelData.rules[i];
                
                var maxAccepting = extractMaxDimensions(currRule.points);
                currRule["width"] = maxAccepting[0];
                currRule["height"] = maxAccepting[1];
            }
        }
    }
}

// extract the max width/height
function extractMaxDimensions(points) {
    var maxWidth = 0;
    var maxHeight = 0;

    for (var i = 0 ; i < points.length; i++){
        var currWidth = points[i][0] + 1;
        var currHeight = points[i][1] + 1;

        // update
        if (currWidth > maxWidth)
            maxWidth = currWidth;
        if (currHeight > maxHeight)
            maxHeight = currHeight;
    }

    // return as a tuple
    var ret = [maxWidth, maxHeight];
    return ret;
}

addRuleParams();

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
    ruleSet = levels[this.currGame].ruleset;
    resources = levels[this.currGame].resources;
}

// getters/setters

module.exports.getRuleset = function() {
    this.updateData();
    return ruleSet;
}

module.exports.getResources = function() {
    this.updateData();
    return resources;
}

module.exports.updateNumLevels = function(document) {
    // get the level selector
    var selector = document.getElementById("level_selector");

    for (var key in levels) {
        if (levels.hasOwnProperty(key)) {
            var newLink = document.createElement("a");
            newLink.setAttribute("class", "dropdown-item");
            newLink.setAttribute("href", "/?level=" + key);
            newLink.innerHTML = key;

            selector.appendChild(newLink);
        }
    }
}