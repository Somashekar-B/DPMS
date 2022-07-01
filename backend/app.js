const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');

const Users = require('./database/models/users');
const Projects = require('./database/models/projects');
const Departments = require('./database/models/departments');
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/projects', (req, res) => {
    Projects.find({})
        .then(projects => {console.log(projects.length), res.send(projects)})
        .catch((error) => console.log(error));
});

app.post('/projects', (req, res) => {
    var proId = "";
    var count;
    var yr = req.body.year;
    // console.log(yr);
    var dep = "";
    if (!req.body.department.localeCompare("Computer Science")) {
        this.dep = "CS";
    }
    // console.log(this.dep)

    var proType = "";
    switch (req.body.pro_type) {
        case "Minor":
            this.proType = "MN"
            break;
        
        case "Major":
            this.proType = "MJ";
            break;    
    
        default: this.proType = "HB";
            break;
    }

    proId = yr + "" + req.body.semester + "" +this. dep + "" + this.proType;
    
    if(req.body.pro_type === "Hobby"){
        
        Projects.find({
            'year': yr,
            'semester': req.body.semester,
            'pro_type': req.body.pro_type,
            'department': req.body.department,
            'pro_level': req.body.pro_level,
            'pro_type' : req.body.pro_type
        })
        .then(projects => {
            if(projects.length == 0){
                this.count = 1               
            }
            else{
                this.count = projects.length + 1
            }    
            // console.log(this.count);
            
            if((this.count) < 10)
            this.count = "0"  + this.count;
            
            this.proId = proId + "" + this.count;
            // console.log(this.proId)
        })    
    }

    else{
        proId = proId + req.body.batch;
    }

    // console.log(req.body.students);

    // console.log(this.proId);
    new Projects({
        'projectId':this.proId, 
        
        'title': req.body.title, 
        'department': req.body.department, 
        'year': req.body.year,
        'pro_level': req.body.pro_level,
        'pro_type': req.body.pro_type,
        'semester': req.body.semester,
        'batch': req.body.batch,
        'students' : req.body.students,
        'technologies': req.body.technologies,
        'guided_by': req.body.guided_by,
        // 'synopsis': req.body.synopsis,
        // 'report': req.body.report,
        'dis_synopsis': req.body.dis_synopsis,
        'dis_report': req.body.dis_report,
        'modified_by':req.body.modified_by,
        'modified_on': Date()
    }).save()
        .then((projects) => {res.send(projects)})
        .catch((error) => console.log(error));

        this.proId =""
})

app.delete('/projects/deleteAll', (req, res) =>{
    Projects.deleteMany({})
        .then((projects) => res.send(projects))
        .catch((error) => console.log(error));
})

app.listen(PORT, ()=> console.log(`Server connected to port ${PORT}`));