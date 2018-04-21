/*
    Description: Singleton class containing whether the current problem is completed
*/

// current problem
module.exports.problemSolved = false;

// set the problem
module.exports.problemCompleted = function() {
    this.problemSolved = true;
}