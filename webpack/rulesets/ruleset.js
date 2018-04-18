module.exports = {
    rules: 
    [
        {
            points: [[1,0,1], [0,1,1], [1,1,1], [2,1,1], [1,2,1], [1,3,1]],
            generating: [],
            width: 3,
            height: 4,
        },
        {
            points: [[0,0,1], [1,0,1], [2,0,1], [3,0,1]],
            generating: [[-1,0,2],[4,0,2]],
            width: 4,
            height: 1,
        },
        {
            points: [[0,0,1], [1,0,1], [2,0,1], [0,1,1], [2,1,1], [0,2,1], [2,2,1], [0,3,1], [1,3,1], [2,3,1]],
            generating: [[1,1,2],[1,2,2]],
            width: 3,
            height: 4,
        }
    ]
}