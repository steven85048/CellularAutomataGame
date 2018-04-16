// ============================================ GLOBALS ===================================

var ruleSet = require('../rulesets/ruleset.js');

/*
    DFA is encoded as a map starting from the startState. Each node is encoded as follows:
    DFA = 
    {
        Accepting: boolean, 
        Transition: Map - <(Movement Direction, To-State-Color), DFA>
        Generating: (if accepting, specify the cells generated - relative to the upper left corner)
    }
*/
var startState;

// ============================================ CLASS SETUP ================================

var DFA = function() {
    // preprocessing
    loadDFAFromRuleset();
}

module.exports = DFA;

// access the ruleset and load the DFA
function loadDFAFromRuleset() {
    // get the ruleset strings
    var rulesetStrings = generateStateTransition(ruleSet);
    console.log(rulesetStrings);

    // then from those strings generate the DFA
    var combDFA = generateDFA(rulesetStrings);

} 

// using ruleset strings, generate the DFA:
function generateDFA(rulesetStrings){
    // first create the start node
    startState = 
    {
        Accepting: false,
        Transition: {},
        Generating: null,
    };

    // loop through all rules and add to DFA
    for (var i = 0 ; i < rulesetStrings.length; i++){
        var rule = rulesetStrings[i];
        startState = addRuleToDFA(rule, startState);
    }

    return startState;
}

// add a rule to the current DFA
function addRuleToDFA(rule, startState){
    // loop through all the rules
    for (var i = 0 ; i < rule.length; i++){

    }
}

// convert the whole ruleset into an array of input strings
function generateStateTransition(ruleSet) {
    var rulesetStrings = [];

    // loop through each rule, get the string for each, and append to total strings
    for (var i = 0 ; i < ruleSet.rules.length; i++){
        var currRule = ruleSet.rules[i];
        var inputString = generateInputString(currRule);
        rulesetStrings.push(inputString);
    }

    return rulesetStrings;
}

// convert a rule into an input string
function generateInputString(currRule){

    // put all the points into a hash
    var pointHash = {};
    for (var j = 0 ; j < currRule.points.length; j++)
        pointHash[[currRule.points[j][0], currRule.points[j][1]]] = currRule.points[j][2];
    
    // generate the input string for this rule
    var width = currRule.width;
    var height = currRule.height;
    
    var inputString = [];
    var currChar;

    // loop through the rectangle
    for (var j = 0 ; j < width; j++){
        // set the direction to down
        currChar = "D";

        for (var k = 0 ; k < height; k++){
            var inputCharacter;

            // check three cases (a) if the point is filled (b) if a point neighbor is filled (c) if the point is zero
            if (pointHash[[j, k]]){
                inputCharacter = [currChar, pointHash[[j,k]]];
            } else if (pointHash[[j-1,k]] || pointHash[[j+1,k]] || pointHash[[j,k-1]] || pointHash[[j,k+1]]){
                inputCharacter = [currChar, 0];
            } else {
                inputCharacter = [currChar, -1];
            }

            // set the direction to right
            currChar = "R";

            // append that character to the string
            inputString.push(inputCharacter);
        }
    }

    return inputString;
}