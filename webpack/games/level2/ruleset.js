module.exports = {
    accepting_rule: [{
        points: [[0,0,3], [1,0,2], [2,0,3], [1,1,2]],
        generating: [],
        width: 3,
        height: 2,
    }],
    rules: 
    [
        {
            points: [[0,0,1],[1,0,1],[2,0,1]],
            generating: [[0,1,2]],
            width: 3,
            height: 1,
        },
        {
            points: [[0,0,1],[1,0,1]],
            generating: [[1,-1,2]],
            width: 2,
            height: 1,
        },
        {
            points: [[0,0,1],[1,0,1],[0,1,2],[0,2,1], [1,2,1]],
            generating: [[-1,1,3],[1,1,3]],
            width: 2,
            height: 3,
        },
    ]
}