// ============================ GLOBALS ==========================

// dom object
var document;
var container;

var numTiles = 5;
var tileWidth = 32;
var tileHeight = 32;

// =========================== CLASS INIT ========================

var TileDisplay = function(aDocument) {
    // init globals
    document = aDocument;
    container = document.getElementById("tile_display");

    // add title
    addTileDisplay();
};

module.exports = TileDisplay;

// ======================= DISPLAY ===============================
//<div style = "background-image: url('./assets/tileset.png'); width: 32px; height: 32px; background-position: left 0px top -64px;"> </div>

// create the tiles
function addTileDisplay() {
    for (var i = 0 ; i < numTiles; i++){
        // create new enclosing div
        var newDiv = document.createElement("div");

        // get the tile position (in tilemap)
        var tilePosition = (-1) * (i * tileWidth);

        // create the image
        var imageDiv = document.createElement("div");
        imageDiv.classList.add("tile-image");
        imageDiv.setAttribute('style', "background-position: left 0px top " + tilePosition + "px");

        // add that to the div
        newDiv.appendChild(imageDiv);

        container.appendChild(newDiv);
    }
}