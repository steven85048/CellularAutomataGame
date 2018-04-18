// ============================ GLOBALS ==========================

var app;
var PIXI;

// =========================== CLASS INIT ========================

var RulesetDisplay = function(aPIXI, aApp) {
    // init globals
    PIXI = aPIXI;
    app = aApp;

    console.log("ruleset display");

    // add title
    addRulesTitle();
};

module.exports = RulesetDisplay;

// ======================= DISPLAY ===============================

// create the rules title text
function addRulesTitle() {
    var style = new PIXI.TextStyle({
        stroke: '#000000',
        fontSize: 35,
        fill: '#FFFFFF'
    })

    // initialize the title
    var title = new PIXI.Text('Ruleset', style);
    title.x = 1390;
    title.y = 15;

    // add it to the stage
    app.stage.addChild(title);
}