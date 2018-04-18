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

// =========================================== DFA INITIALIZATION ============================

// access the ruleset and load the DFA
function loadDFAFromRuleset() {
    // get the ruleset strings
    var rulesetStrings = generateStateTransition(ruleSet);
    
    // then from those strings generate the DFA
    var combDFA = generateDFA(rulesetStrings);

} 

// using ruleset strings, generate the DFA:
function generateDFA(rulesetStrings){
    // first create the start node
    startState = 
    {
        accepting: false,
        transition: {},
        generating: null,
    };

    // loop through all rules and add to DFA
    for (var i = 0 ; i < rulesetStrings.length; i++){
        var rule = rulesetStrings[i];
        addRuleToDFA(rule, startState, i);
    }

    return startState;
}

// add a rule to the current DFA
function addRuleToDFA(rule, startState, index){
    var pointer = startState;

    // loop through all the rules
    for (var i = 0 ; i < rule.length; i++){
        var inputCharacter = rule[i];

        // keep traversing if the transition already exists
        if (pointer.transition[inputCharacter]){
            pointer = pointer.transition[inputCharacter];
        } else { // make a new transition
            var newState = 
            {
                accepting: false,
                transition: {},
                generating: null,
            };

            pointer.transition[inputCharacter] = newState;
            pointer = newState;
        }
    }

    // set the last state as accepting and append the generating rules
    pointer.accepting = true;
    pointer.generating = ruleSet.rules[index].generating;
    
}

// convert the whole ruleset into an array of input strings
function generateStateTransition(ruleSet) {
    var rulesetStrings = [];

    // loop through each rule, get the string for each, and append to total strings
    for (var i = 0 ; i < ruleSet.rules.length; i++){
        var currRule = ruleSet.rules[i];
        var inputString = generateInputString(currRule.points, 0, 0, currRule.width, currRule.height);
        rulesetStrings.push(inputString);
    }

    return rulesetStrings;
}

// convert a rule into an input string
function generateInputString(points, xCorner, yCorner, width, height){

    // put all the points into a hash
    var pointHash = {};
    for (var j = 0 ; j < points.length; j++)
        pointHash[[points[j][0], points[j][1]]] = points[j][2];
    
    var inputString = [];
    var currChar;

    // loop through the rectangle
    for (var j = xCorner ; j < xCorner + width; j++){
        // set the direction to down
        currChar = "R";

        for (var k = yCorner ; k < yCorner + height; k++){
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
            currChar = "D";

            // append that character to the string
            inputString.push(inputCharacter);
        }
    }

    return inputString;
}

// ======================================== PASSING INPUT STRING ====================================

// pass the disjoint set through the dfa
DFA.prototype.passInput = function(disjointSet) {
    // extract all the parameters for rule selection
    var points = disjointSet.members;
    var xCorner = disjointSet.bounds[0][0];
    var yCorner = disjointSet.bounds[0][1];
    var width = disjointSet.bounds[1];
    var height = disjointSet.bounds[2];

    // then create the input string
    var inputString = generateInputString(points, xCorner, yCorner, width + 1, height + 1);

    // then pass that input string through the dfa
    return determineAccept(inputString);
}

// passes the input string through the dfa
function determineAccept(inputString) {
    var pointer = startState;

    // loop through the input
    for (var i = 0 ; i < inputString.length; i++){
        var inputCharacter = inputString[i];
        
        // keep looping until accept or not
        if (pointer.transition[inputCharacter]){
            pointer = pointer.transition[inputCharacter]; 
        } else {
            return false;
        }
    }

    // if ending in accept state or not
    if (pointer.accepting)
        return pointer.generating;
    else
        return false;
}