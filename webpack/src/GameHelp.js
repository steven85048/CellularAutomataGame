// Singleton class with the help modal
var helpMapping = 
{
    level1 : "Welcome to Tirmat! The objective of this game is to place blocks on the grid in a way that matches the accepting rule. Try to match the rule shown in the left. If you mess up, simply press the undo button or restart the level!",
    level2 : "The amount of resources alloted for each level is shown in the left bar. Use number keys (0-9) to switch between resources.",
    level3 : "Usually, the amount of resources given is not enough to create the accepting rule immediately. These missing resources can be created by matching one of the subrules below the accepting rule and pressing Generate. The flashing blocks are the blocks that are generated.",
    level4 : "However, the amount of generates is also limited. Conserve generates by matching multiple subrules at once and only generating once.",
    level5 : "Sometimes, even after generating, there may be the correct of resources on the board, but it is not of the correct structure. Fix the shape by using the refund resource (0) to refund that resource to place it elsewhere. Note that refunds are also limited!",
    level6 : "Note that a shape matches with a rule ONLY if all the tiles match with the rule and each side of the shape is bordered by an empty tile. A shape still matches with a rule if there is a filled tile touching a corner of the shape however."
};

module.exports.setHelpText = function(levelNum, document) {
    var helpButton = document.getElementById("help_button");

    if (helpMapping[levelNum]){
        // SET THE TEXT of the modal and click the button
        document.getElementById("tutorial_text").innerHTML = helpMapping[levelNum];
        helpButton.click();

    } else {
        // set the button as unclickable
       helpButton.style.visibility = "hidden";
    }
}
