module.exports = {
    accepting_rule: [{
        points: [[0,0,2],[1,0,1],[2,0,1],[2,1,3],[3,1,3],[4,1,1],[5,1,2]],
        generating: [],
        width: 6,
        height: 2,
    }],
    rules: 
    [
        {
            points: [[1,0,2],[0,1,1],[1,1,1]],
            generating: [[1,2,3]],
            width: 2,
            height: 2,
        },
        {
            points: [[0,0,1],[1,0,2]],
            generating: [[-1,0,3]],
            width: 2,
            height: 1,
        },
        {
            points: [[1,0,2],[0,1,1],[1,1,1],[2,1,1]],
            generating: [[1,2,3]],
            width: 3,
            height: 2,
        }
    ]
}