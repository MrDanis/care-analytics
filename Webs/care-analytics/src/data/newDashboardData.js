export const  newdashboardData = {
    dashboardStats:[
        {
            statsText:'Patient',
            statsValue:'4,253'
        },
        {
            statsText:'Enrolled',
            statsValue:'1,2045'
        },
        {
            statsText:'Eligible',
            statsValue:'2,253'
        }
    ],
    analysisPopulationData:[
        ['Expire', 3,true],
        ['Admit to IFR', 2,true],
        ['Admit to LTAC', 2,true]
    ],
    analysisPopulationColors:['#288de8','#207bcb','#bdbef5'],
    analysisPopulationType:'pie',
    analysisPopulationTitle:'Cost Benifite Analysis for Enrolled Population',
    analysisDiscriptions:{
        enrolledPatient:21,
        startDate:'01/01/2022',
        endDate:'01/01/2023',
    },
    pmpCostAnalysis:{
        data:[{
            name: 'Complete Tasks',
            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
    
        }, {
            name: 'Completed Appointment',
            data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
        }],
       xAxisLabels:[
       'Catherine',
       'Harlod',
       'Victoria Daigle',
       'Thelma Paschall',
       'Howard Cleaves',
       'Clifton Merritt',
       'Willie Pope',
       'Willie Pope',
       'Willie Pope',
       'Willie Pope',
       'Willie Pope',
       'Willie Pope',],
       type:'column',
       title:'PMPM Cost Analysis'
    },
    pcpVisits:{
        title:'PCP Visits',
        data:[{
            name: 'Complete Tasks',
            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
    
        }, {
            name: 'Completed Appointment',
            data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
    
        }],
        xAxisLabels:[
            'Catherine',
            'Harlod',
            'Victoria Daigle',
            'Thelma Paschall',
            'Howard Cleaves',
            'Clifton Merritt',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
            'Willie Pope',
        ],
        type:'column'
    },
    transitionalCareManagement:{
        title:'Transitional Care Management (RIO)',
        data:[{
            name: 'Total Alerts',
            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
    
        }, {
            name: 'No of Alerts TCM startes on',
            data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
    
        },
        {
            name: 'No of Re-admission',
            data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
    
        }
    ],
        xAxisLabels:[
            '2023',
            '2022',
            '2021',
            '2020',
            '2019',
            '2018',
            '2017',
            '2016',
            '2015',
            '2014',
            '2013',
            '2012',
            
        ],
        type:'column',
    },
    enrolmentCount:{
        title:'Enrollemt Counts',
        data:[{
            name: 'Complete Tasks',
            data: [49, 71, 106, 129, 144]
        }],
        xAxisLabels:['2018',
        '2019',
        '2020',
        '2021',
        '2022'],
        type:'spline'
    },
    enrolmentTrend:{
        title:'Enrollment Trends',
        data:[{
            name: 'Complete Tasks',
            data: [49, 71, 106, 129, 144    ]
      
        }],
        xAxisLabels:[
            '2018',
            '2019',
            '2020',
            '2021',
            '2022'
        ],
        type:'spline'
    },
    hospitalization:{
        
            title:'Hospitalizations',
            data:[{
                name: 'Complete Tasks',
                data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
        
            }, {
                name: 'Completed Appointment',
                data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
        
            }],
            xAxisLabels:[
                'Catherine',
                'Harlod',
                'Victoria Daigle',
                'Thelma Paschall',
                'Howard Cleaves',
                'Clifton Merritt',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
            ],
            type:'column'
        
    },
    avgHospitalization:{
       colors:['#288de8','#207bcb','#bdbef5'],
       type:'pie',
       data:[
        ['Expire', 3,true],
        ['Admit to IFR', 2,true],
        ['Admit to LTAC', 2,true]
       ],
       title:'AVG Hospitalization Per Month for Enrolled Patients',
       discription:{
           enrolledPatient:21,
           startDate:'01/01/2022',
           endDate:'01/01/2023',
       }
    },
    reAdmission:{
        title:'Re-admissions Percentages',
            data:[{
                name: 'Complete Tasks',
                data: [49, 71, 106, 129, 144, 176, 135,106, 129, 144, 176, 135]
        
            }, {
                name: 'Completed Appointment',
                data: [78, 98, 93, 106, 84, 105, 104,106, 129, 144, 176, 135]
        
            }],
            xAxisLabels:[
                'Catherine',
                'Harlod',
                'Victoria Daigle',
                'Thelma Paschall',
                'Howard Cleaves',
                'Clifton Merritt',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
                'Willie Pope',
            ],
            type:'column'
       },
    reAdmissionPercentage:{
       colors:['#288de8','#207bcb','#bdbef5'],
       type:'pie',
       data:[
        ['Expire', 3,true],
        ['Admit to IFR', 2,true],
        ['Admit to LTAC', 2,true]
       ],
       title:'Re-admissions Analysis for Enrolled Patients',
       discription:{
           enrolledPatient:21,
           startDate:'01/01/2022',
           endDate:'01/01/2023',
       }
    }
}