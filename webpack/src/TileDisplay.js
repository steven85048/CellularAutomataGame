// ============================ GLOBALS ==========================

// dom object
var document;
var container;

// dom objects
var mainDivs = [];
var resourceCount = [];

// keep track of highlighted
var currHighlighted = -1;

var numTiles = 5;

var tileWidth = 32;
var tileHeight = 32;

var boardWidth = 1280;
var boardHeight = 960;

var firstSelected = 1;

// =========================== CLASS INIT ========================

var TileDisplay = function(aDocument) {
    // init globals
    document = aDocument;

    // initialize main container
    initMainContainer();

    // add title
    initTileDisplay();

    // highlight initial one
    this.highlightCell(firstSelected);
};

module.exports = TileDisplay;

// ======================= INITIALIZATION ===============================

// initialize the main container
function initMainContainer() {
    // get container from dom
    container = document.getElementById("tile_display");

    // calculate center margin and set attribute
    var leftSize = (window.innerWidth - boardWidth) / 2;
    var marginCenter = ((boardWidth - ((tileWidth + 50) * numTiles))/2) + leftSize;
    container.setAttribute('style', "overflow: hidden; margin-left: " + marginCenter + "px;");

}

// create the tiles
function initTileDisplay() {
    for (var i = 0 ; i < numTiles; i++){
        // create new enclosing div
        var newDiv = document.createElement("div");
        newDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px;")

        // get the tile position (in tilemap)
        var tilePosition = (-1) * (i * tileWidth);

        // create the image
        var imageDiv = document.createElement("div");
        imageDiv.classList.add("tile-image");
        imageDiv.setAttribute('style', "background-position: left 0px top " + tilePosition + "px; float: left; display: inline-block;");

        // create the text
        var text = document.createElement("h2");
        text.setAttribute('style', "margin-left: 10px; margin-top: 6px;")
        text.innerHTML = 0;

        // add to array
        mainDivs.push(newDiv);
        resourceCount.push(text);

        // add that to the div
        newDiv.appendChild(imageDiv);
        newDiv.appendChild(text);

        container.appendChild(newDiv);
    }
}

// ============================= SETTING ==================================

// select the cell at that location
TileDisplay.prototype.highlightCell = function(index) {
    // check out of bounds
    if (index > numTiles)
        return;

    // get the relevant div
    var toSelectDiv = mainDivs[index];

    // first deselect the currently highlighted cell
    if (currHighlighted != -1){
        // get the current div and update the style
        var currDiv = mainDivs[currHighlighted];
        currDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px;");
    }

    // then select the new div
    toSelectDiv.setAttribute('style', "display: inline-block; float:left; margin-right: 50px; border-style: dotted; border-width: 2px");

    // update the current highlighted
    currHighlighted = index;
}