/*
*   Entry for the webpack build: builds the bundle and sets entry point
*   to the index.js file
*/

var path = require("path");
var webpack = require('webpack');

// path where the bundle.js will be saved
var DIST_DIR = path.join(__dirname, "./views/scripts");

module.exports = {
    // base address for the src files
    context: path.resolve(__dirname, "webpack/src"),

    // file that bundle.js will be created from
    entry: "./gameEngine.js",

    // define how the result bundle will be stored
    output: {
        path: DIST_DIR,
        filename: "bundle.js"
    },
};