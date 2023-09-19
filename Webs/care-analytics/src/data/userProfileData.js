export const profileScreenData = {
    genralStatsData:{
        totalCounts:[
            {totalText:'Total Task',totalCountVal:2000},
            {totalText:'Completed Task',totalCountVal:952}
        ],
        allStats:[
            {statText:'In-Patient',statValue:684},
            {statText:'Emergency',statValue:952},
            {statText:'Readmission',statValue:18},
            {statText:'Total Alerts',statValue:3052},
        ],
        genralCounts:[
            {
                genralCountText:'Resolve Interventions',
                genralCountAchive:154,
                genralCountTotall:100
            },
            {
                genralCountText:'Successful Calls',
                genralCountAchive:4025,
                genralCountTotall:6124
            },
            {
                genralCountText:'AWVs Completed',
                genralCountAchive:18,
                genralCountTotall:100
            },
            {
                genralCountText:'Quality Gaps Closed',
                genralCountAchive:54,
                genralCountTotall:100
            },
            {
                genralCountText:'Achieved Goals',
                genralCountAchive:2457,
                genralCountTotall:6879
            },
            {
                genralCountText:'Resolve Interventions',
                genralCountAchive:4253,
                genralCountTotall:100
            }
        ],
        genralStats:[
            {genralStatsText:'Appointments',genralStatsValPercent:10,genralStatsAchiveVal:54,genralStatsTotalVal:65},
            {genralStatsText:'Quality achived',genralStatsValPercent:10,genralStatsAchiveVal:1,genralStatsTotalVal:1},
            {genralStatsText:'Compliance achived',genralStatsValPercent:70,genralStatsAchiveVal:1,genralStatsTotalVal:1},
            {genralStatsText:'Task Completed',genralStatsValPercent:75,genralStatsAchiveVal:10,genralStatsTotalVal:65}
        ]
    },
    userReports:{
        tasksReport:{
            taskStats:[
                {taskStatsLabel:'Appointments',taskStatsValue:4253},
                {taskStatsLabel:'Avg. appointments',taskStatsValue:50},
                {taskStatsLabel:'Task Completed',taskStatsValue:4253},
                {taskStatsLabel:'Avg. Task Completed',taskStatsValue:4253},
            ],
            taskChartData:[
                {
                    type:'column',
                    data:[{
                        name: 'Complete Tasks',
                        data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
                
                    }, {
                        name: 'Completed Appointment',
                        data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
                
                    }],
                    labels:['Jan','Feb','Mar','Apr','May','jun','jul','Aug','Sep','Oct','Nov','Dec']
                }
            ],
            enrollmentTrendChartData:[
                {
                    type:'spline',
                    data:[{
                        name: 'Complete Tasks',
                        data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
                
                    }],
                    labels:['Jan','Feb','Mar','Apr','May','jun','jul','Aug','Sep','Oct','Nov','Dec']
                }
            ],
            hospitalVisitsChartData:[
                {
                    type:'column',
                    labels:['Jan','Feb','Mar','Apr','May','jun','jul','Aug','Sep','Oct','Nov','Dec'],
                    data:[
                        {
                            name: 'In-patients',
                            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
                        }, {
                            name: 'Emergency',
                            data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
                        },
                        {
                            name: 'Readmission',
                            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
                        },
                    ],
                    hospitalVisitsStats:[
                        {taskStatsLabel:'In-Patient',taskStatsValue:4253},
                        {taskStatsLabel:'Avg. In-Patient',taskStatsValue:50},
                        {taskStatsLabel:'Emergency',taskStatsValue:4253},
                        {taskStatsLabel:'Avg. Emergency',taskStatsValue:4253}
                    ]
                }
            ]
        }
    }

}