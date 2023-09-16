const express = require('express');
const cors = require('cors');
const dataStore = require('nedb')
const app = express();
const db = new dataStore('care-analytics.db');
// const programData = require('./Modals/programeData')
// const programRoutes = require('./Routes/programRoutes');
// creating the server for Socket.io
const http = require("http").Server(app);
// New import for creating the server is http://localhost:5173/
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.loadDatabase();
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with the request (if applicable)
  }));
// Listening when the user is connected with the socket.io
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('send-message',(data)=>{
        console.log('Message comming from the client is : ',data);
    })
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});
// Listening the socket is end from here.....


//  All the End Points start from the below 
app.get('/api/fill-programs',(req,res)=>{
    const ProgrameData = [
        {
            programeId:1,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Care Coordination',
            programeModules:[
                {
                    programeId:1,
                    moduleId:11,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                },
                {
                    programeId:1,
                    moduleId:12,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:1,
                    moduleId:13,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:1,
                    moduleId:14,
                    moduleName:'Medication adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:1,
                    moduleId:15,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:1,
                    moduleId:16,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:2,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Chromic Care Management',
            programeModules:[
                {
                    programeId:2,
                    moduleId:21,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                },
                {
                    programeId:2,
                    moduleId:22,
                    moduleName:'Hospitalization',
                    isModuleAssigned:false,
                },
                {
                    programeId:2,
                    moduleId:23,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:2,
                    moduleId:24,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:2,
                    moduleId:25,
                    moduleName:'Medication adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:2,
                    moduleId:26,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:3,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Transitional Care Management',
            programeModules:[
                {
                    programeId:3,
                    moduleId:31,
                    moduleName:'Hospitalization',
                    isModuleAssigned:false,
                },
                {
                    programeId:3,
                    moduleId:32,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:3,
                    moduleId:33,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:3,
                    moduleId:34,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:3,
                    moduleId:35,
                    moduleName:'Medication adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:3,
                    moduleId:36,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:4,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Heart Failure',
            programeModules:[
                {
                    programeId:4,
                    moduleId:41,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:4,
                    moduleId:42,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:4,
                    moduleId:43,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:4,
                    moduleId:44,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:4,
                    moduleId:45,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:4,
                    moduleId:46,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:5,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Chronic Obstructive Pulmonary Disease',
            programeModules:[
                {
                    programeId:5,
                    moduleId:51,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:5,
                    moduleId:52,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:5,
                    moduleId:53,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:5,
                    moduleId:54,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:5,
                    moduleId:55,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:5,
                    moduleId:56,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:6,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Cancer',
            programeModules:[
                {
                    programeId:6,
                    moduleId:61,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:6,
                    moduleId:62,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:6,
                    moduleId:63,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:6,
                    moduleId:64,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:6,
                    moduleId:65,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:6,
                    moduleId:66,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:7,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Asthma',
            programeModules:[
                {
                    programeId:7,
                    moduleId:71,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:7,
                    moduleId:72,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:7,
                    moduleId:73,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:7,
                    moduleId:74,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:7,
                    moduleId:75,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:7,
                    moduleId:76,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:8,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Diabetes Education Program',
            programeModules:[
                {
                    programeId:8,
                    moduleId:81,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:8,
                    moduleId:82,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:8,
                    moduleId:83,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:8,
                    moduleId:84,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:8,
                    moduleId:85,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:8,
                    moduleId:86,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:9,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'Social Determinants of Health',
            programeModules:[
                {
                    programeId:9,
                    moduleId:91,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:9,
                    moduleId:92,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:9,
                    moduleId:93,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:9,
                    moduleId:94,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:9,
                    moduleId:95,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:9,
                    moduleId:96,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:10,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'SWHR-COVID',
            programeModules:[
                {
                    programeId:10,
                    moduleId:101,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:10,
                    moduleId:102,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:10,
                    moduleId:103,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:10,
                    moduleId:104,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:10,
                    moduleId:105,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:10,
                    moduleId:106,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
        {
            programeId:11,
            programmeCreatedDate:'',
            programeEditedDate:'',
            progeameName:'AQ Program Test',
            programeModules:[
                {
                    programeId:11,
                    moduleId:111,
                    moduleName:'TCM Stats',
                    isModuleAssigned:false,
                },
                {
                    programeId:11,
                    moduleId:112,
                    moduleName:'Medication Adherence',
                    isModuleAssigned:false,
                },
                {
                    programeId:11,
                    moduleId:113,
                    moduleName:'ReAdmission',
                    isModuleAssigned:false,
                },
                {
                    programeId:11,
                    moduleId:114,
                    moduleName:'Hospitalizations',
                    isModuleAssigned:false,
                },
                {
                    programeId:11,
                    moduleId:115,
                    moduleName:'Enrollment Trend',
                    isModuleAssigned:false,
                },
                {
                    programeId:11,
                    moduleId:116,
                    moduleName:'PMPM',
                    isModuleAssigned:false,
                }
            ]
        },
    ]
    // Below lopp is used to insert the data in the db

   for(let i=0;i<ProgrameData.length;i++)
   {
       db.insert(ProgrameData[i]);
       console.log('Inserting the document no : ',i+1);
   }
})
// End Point for retriving all the records (START)
app.get('/api/program/get-all-modules',(req,res)=>{
    db.find({},(err,data)=>{
        if(err)
        {
            res.end();
            return;
        }
        let sortedData = data.sort((a,b)=> a.programeId-b.programeId )
        res.send(sortedData);
    });
})
// End Point for retriving all the records (END)
// End Point for updating the records (START)
app.post('/api/program/update-modules',(req,res)=>{
    console.log('Data list for updating record is : ',req?.body?.updatedList);
    //get all the records form the database
    db.find({},(err,data)=>{
        if(err)
        {
            res.send({data:'false',statusCode:204});// all the records are updated successfully 
            res.end();
            return;
        }
        else
        {
            // sort the data comming from the DB
               console.log('data after getting from the DB is : ',(data));
            let sortedData = data.sort((a,b)=> a.programeId-b.programeId )
            // sort the upcomming data comming form the client
            let sortIncommingList = req?.body?.updatedList.sort((a,b)=> a.programeId-b.programeId);
             
            console.log('data is : ',sortedData);
    

            // for(let i =0; i<sortIncommingList.length; i++)
            // {
            //     // find the parent index 
            //     console.log('sorted data is : ',sortedData)
            //    let parentIndex =  Array.from(sortedData).findIndex(sortIncommingList[i].programeId);
            //    console.log('Parent Index is : ',parentIndex);
            //     // find the child index
            //     // let childIndex = sortedData[parentIndex].programeModules.findIndex(sortIncommingList[i].moduleId); 
            //     // // update the child in the parent list
            //     // sortedData[parentIndex].programeModules[childIndex].isModuleAssigned = sortIncommingList[i]?.isModuleAssigned;
            //     // // add the updated data in the db by updating the chlid list of it
            //     // db.update({programeId:sortIncommingList.programeId},{$set :{programeModules:sortedData[parentIndex]?.programeModules}},{},(err, numReplaced)=>{
            //     //    console.log('Record is updated with the affected row count# : ',numReplaced); 
            //     // })
            // }

            res.send({data:'true',statusCode:200});    // all the records are updated successfully 
        }

    })
})
// End Point for updating the records (END)

// programRoutes.use('/api/program',programRoutes)
http.listen(7000,()=>{console.log('Server is listening.....')});
