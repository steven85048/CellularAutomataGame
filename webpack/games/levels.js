// TOTAL FILE WITH LEVELS (Eventually may want to move to backend idk depends on how i feel)

/* EX:
    level6:
    {
        ruleset:
        {
            accepting_rule: [{
                
            }],
            rules: [{

            }]
        },
        resources:
        {
            resources: [],
            generations: 0,
        }
    }
*/

module.exports = 
{
    level1:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,1], [1,0,1], [0,1,1]],
                generating: [],
            }],
            rules: []
        },
        resources:
        {
            resources: [0,3,0,0],
            generations: 0,
        }
    },
    level2:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,1],[1,0,2],[0,1,3],[1,1,4]],
                generating: [],
            }],
            rules: []
        },
        resources:
        {
            resources: [0,1,1,1,1],
            generations: 0,
        }
    },
    level3:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,1], [1,0,1], [0,1,1],[1,1,2]],
                generating: []
            }],
            rules: [{
                points: [[0,0,1], [1,0,1], [0,1,1]],
                generating: [[1,1,2]]
            }]
        },
        resources:
        {
            resources: [0,3,0,0],
            generations: 1,
        }
    },
    level4:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[3,0,1],[3,1,1],[0,3,1],[1,3,1],[2,3,2],[3,3,2]],
                generating: []
            }],
            rules: [
            {
                points: [[0,0,1], [1,0,1]],
                generating: [[2,0,2]]
            },
            {
                points: [[0,0,1], [0,1,1]],
                generating: [[0,2,2]]
            }
            ]
        },
        resources:
        {
            resources: [0,4,0,0],
            generations: 1,
        }
    },
    level5:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,1], [1,0,1], [2,0,1], [2,1,2]],
                generating: []
            }],
            rules: [{
                points: [[0,0,1], [1,0,1], [2,0,1]],
                generating: [[0,-1,2]]
            }]
        },
        resources:
        {
            resources: [1,3,0,0],
            generations: 1,
        }
    },
    level6:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,2],[1,0,1],[2,0,1],[2,1,3],[3,1,3],[4,1,1],[5,1,2]],
                generating: [],
            }],
            rules: 
            [
                {
                    points: [[1,0,2],[0,1,1],[1,1,1]],
                    generating: [[1,2,3]],
                },
                {
                    points: [[0,0,1],[1,0,2]],
                    generating: [[-1,0,3]],
                },
                {
                    points: [[1,0,2],[0,1,1],[1,1,1],[2,1,1]],
                    generating: [[1,2,3]],
                }
            ]
        },
        resources:
        {
            resources: [1,3,2,0],
            generations: 1,
        }
    },
    level7:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,3], [1,0,2], [2,0,3], [1,1,2]],
                generating: [],
            }],
            rules: 
            [
                {
                    points: [[0,0,1],[1,0,1],[2,0,1]],
                    generating: [[0,1,2]],
                },
                {
                    points: [[0,0,1],[1,0,1]],
                    generating: [[1,-1,2]],
                },
                {
                    points: [[0,0,1],[1,0,1],[0,1,2],[0,2,1], [1,2,1]],
                    generating: [[-1,1,3],[1,1,3]],
                },
            ]
        },
        resources:
        {
            resources: [4,5,0],
            generations: 2,
        }
    },
    level8:
    {
        ruleset:
        {
            accepting_rule: [{
                points: [[0,0,2], [2,0,2], [0,1,1], [1,1,3], [2,1,1], [0,2,1], [1,2,4], [2,2,1], [0,3,2], [1,3,3], [2,3,2], [0,4,1], [2,4,1]],
                generating: [],
            }],
            rules: 
            [
                {
                    points: [[0,0,2], [2,0,2], [0,1,1], [1,1,3], [2,1,1]],
                    generating: [[1,0,4]],
                },
                {
                    points: [[0,0,1],[1,0,1], [1,1,1], [1,2,1]],
                    generating: [[0,1,1], [-1,0,2]],
                },
                {
                    points: [[0,0,1], [0,1,1], [1,1,1]],
                    generating: [[1,0,2], [2,1,1], [0,-1,2]],
                },
                {
                    points: [[0,0,2], [1,0,1], [2,0,2],[0,1,1],[2,1,1],[0,2,1],[2,2,1],[0,3,2],[1,3,1],[2,3,2]],
                    generating: [[1,1,3],[1,2,3]],
                }
            ]
        },
        resources: 
        {
            resources: [8,8,1],
            generations: 3,
        }

    }
}