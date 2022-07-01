const Projects = require('../models/projects');
const Students = require('../models/students');
const Common = require('../models/common');
const fs = require('fs');
const path = require('path');
const exceljs = require('exceljs');
const { on } = require('events');
const { type } = require('os');

exports.insertProject = async (req, res, next) => {
    try {
        if(req.body.distinctStuds.length){
            console.log(req.body.distinctStuds,"");
            stus=  await Students.insertStudentInfo(req.body.distinctStuds)
        }   
        project = await Projects.insertProject(req.body);
        
        prostuds = await Students.insertProStudents(req.body.PRO_ID, req.body.students);  
        proTechs = await  Projects.addProTechs(req.body.PRO_ID, req.body.technologies);
        
        res.status(200).json({
            status: "success",
            body: project,
            statusCode: 200
        });
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message
        });
        next(error);
    }
};


exports.updateProject = async (req, res, next) => {
    try {
        // const off = await Common.setIntegrityOff();
        console.log(req.body)
        if(req.body.distinctStuds.length){
            inStus = await Students.insertStudentInfo(req.body.distinctStuds);
        }   
        if(req.body.oldStus.length){
            updateStus = await Students.updateStudentInfo(req.body.oldStus);
        }
        
        const [result] = await Projects.updateProject(req.body);
        const [project] = await Projects.getProject(req.body.PRO_ID);
        if(req.body.SYNOPSIS){
            if(project[0].SYNOPSIS){
            
                if(fs.existsSync(project[0].SYNOPSIS)){
                    fs.unlink(project[0].SYNOPSIS, (err)=>{
                        if(err){
                        }
                    })
                }
            }
        }
        else{
            if(project[0].SYNOPSIS){
                if(fs.existsSync(project[0].SYNOPSIS)){
                    fs.rename(project[0].SYNOPSIS, 'docs\\projectUploads\\'+req.body.PRO_ID+'-SYNOPSIS'+path.extname(project[0].SYNOPSIS), async (err)=>{
                        if(err){
                        }else{
                            synopsis = await Projects.uploadSynopsis({
                                path:'docs\\projectUploads\\'+req.body.PRO_ID+'-SYNOPSIS'+path.extname(project[0].SYNOPSIS),
                                proId: req.body.PRO_ID
                            })
                        }
                    })
                }
            }
        }
        //REPORT
        if(req.body.REPORT){
            if(project[0].REPORT){
                if(fs.existsSync(project[0].REPORT)){
                    fs.unlink(project[0].REPORT, (err)=>{
                        if(err){
                        }
                        
                    })
                }
            }
        }
        else{
            if(project[0].REPORT){
                if(fs.existsSync(project[0].REPORT)){
                    fs.rename(project[0].REPORT, 'docs\\projectUploads\\'+req.body.PRO_ID+'-REPORT'+path.extname(project[0].REPORT), async (err)=>{
                        if(err){
                        }else{
                            reports = await Projects.uploadReport({
                                path:'docs\\projectUploads\\'+req.body.PRO_ID+'-REPORT'+path.extname(project[0].REPORT),
                                proId: req.body.PRO_ID
                            })
                        }
                    })
                }
            }
        }
        //PPT
        if(req.body.PPT){
            if(project[0].PPT){
                if(fs.existsSync(project[0].PPT)){
                    fs.unlink(project[0].PPT, (err)=>{
                        if(err){
                        }
                    })
                }
            }
        }
        else{
            if(project[0].PPT){
                if(fs.existsSync(project[0].PPT)){
                    fs.rename(project[0].PPT, 'docs\\projectUploads\\'+req.body.PRO_ID+'-PPT'+path.extname(project[0].PPT), async (err)=>{
                        if(err){
                        }else{
                            reports = await Projects.uploadReport({
                                path:'docs\\projectUploads\\'+req.body.PRO_ID+'-PPT'+path.extname(project[0].PPT),
                                proId: req.body.PRO_ID
                            })
                        }
                    })
                }
            }
        }
        deleted = await Students.deleteProStudents(req.body.OLD_PRO_ID);
        prostuds = await Students.insertProStudents(req.body.PRO_ID, req.body.stuUSNs);
        deletedTechs = await Projects.deleteProTech(req.body.OLD_PRO_ID);
        proTechs = await  Projects.updateProTechs(req.body.PRO_ID, req.body.technologies);
        // const on = await Common.setIntegrityOn();
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: project
        });
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message
        });
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try{
        // const off = await Common.setIntegrityOff();
        const project = await Projects.deleteProject(req.body.proId);
        
        const [allProjects] = await Projects.fetchAll(req.userId.DEP_CODE);
        // const on = await Common.setIntegrityOn();
        res.status(200).json({
            body: allProjects,
            message: "Deleted successfully",
            status: 200
        });
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message
        });
        next(error);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const [project] = await Projects.getProject(req.body.proId);
        const [proStuds] = await Students.getStudents(project[0].PRO_ID);
        const [proTechs] = await Projects.getProTech(project[0].PRO_ID);
        const [reviews] = await Projects.getReviews(project[0].PRO_ID);
        // console.log(reviews+'--');
        project.forEach(element => {
            element.students = proStuds;
            element.technologies = proTechs;
            element.reviews = reviews;
        });
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: project
        });
    } catch (error) {
        if(!error.statusCode){      
            error.statusCode = 500
        }
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message
        });
        // console.log("somaa")
        // next(error);  
    }
};

exports.fetchProjects = async (req, res, next) => {
    try {
        var only;
        if(req.body.data.USERTYPE=='Admin'){
           var [allProjects] = await Projects.fetchAll(req.body.data.DEP_CODE);
            
           var [projectTypes] = await Projects.getProjectTypes(req.body.data.DEP_CODE);
           
            [only] = await Projects.fetchAllOfFaculty(req.body.data);
            for(project of only) {
                [proStuds] = await Students.getStudents(project.PRO_ID);
                [proTechs] = await Projects.fetchTechnologies(project.PRO_ID);
                for(proType of projectTypes){
                    if(project.PRO_TYPE == proType.TYPE_CODE && project.LEVEL == proType.LEVEL && project.DEPARTMENT == proType.DEPARTMENT){
                        project.PRO_TYPE = proType.TYPE_NAME;
                        break;
                    }
                }
                project.students = proStuds; 
                project.technologies = proTechs;
            };
        }
        else if(req.body.data.USERTYPE=="Student"){
            [allProjects] = await Projects.fetchAll(req.body.data.DEP_CODE);
            [projectTypes] = await Projects.getAllProjectTypes();
        }
        else{
            [allProjects] = await Projects.fetchAllOfFaculty(req.body.data);
            [projectTypes] = await Projects.getProjectTypes(req.body.data.DEP_CODE);
        } 
            

         for(project of allProjects) {
            [proStuds] = await Students.getStudents(project.PRO_ID);
            [proTechs] = await Projects.fetchTechnologies(project.PRO_ID);
            for(proType of projectTypes){
                if(project.PRO_TYPE == proType.TYPE_CODE && project.LEVEL == proType.LEVEL && project.DEPARTMENT == proType.DEPARTMENT){
                    project.PRO_TYPE = proType.TYPE_NAME;
                    break;
                }
            }
            project.students = proStuds; 
            project.technologies = proTechs;
        };

        res.status(200).json({
            status:"success",
            body: {"allProjects":allProjects, "only": only},
            statusCode: 200
        });
    } catch (error) {
        console.log(error)
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
};

exports.getAllTechs = async (req, res, next) => {
    try {
         const [techs] = await Projects.getAllTechnologies();
         res.status(200).json({
            status: "success",
            statusCode: 200,
            body: techs
        })
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500

            res.status(500).json({
                status: "failed",
                statusCode: 500,
                body: error.message
            });    
    }
    // next(error);
};

exports.getProjectTypes = async (req, res, next) => {
    try {
        [types] = await Projects.getProjectTypes("CS");
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body   : types
        })
        
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500
        
            res.status(500).json({
                status: "failed",
                statusCode: 500,
                body: error.message
            });
    }
    // next(error);
};

exports.addProTypes = async (req, res, next) => {
    try {

        [types] = await Projects.addProjectTypes(req.body);
        res.status(200).json({
            statusCode: 200,
            status:"success",
            body: types
        });
        
    } catch (error) {   
        if(!error.statusCode)
            error.statusCode=500; 
        
            res.status(500).json({
                status: "failed",
                statusCode: 500,
                body: error.message
            })        
            
    }  
}

exports.updateProjectType = async (req, res, next) =>{
    try {
        const off = await Common.setIntegrityOff();
        const [typeUpdate] = await Projects.updateProjectType(req.body);
        const on = await Common.setIntegrityOn();
        res.status(200).json({
            statusCode: 200,
            body: typeUpdate[0]
        })
    } catch (error) {
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body: error
        })
    }
}

exports.deleteProjectTypes = async (req, res, next) => {
    try{
        const off = await Common.setIntegrityOff();
        const projectType = await Projects.deleteProType(req.body);
        const [allProjectTypes] = await Projects.getProjectTypes("CS");
        const on = await Common.setIntegrityOn();

        res.status(200).json({
            body: allProjectTypes,
            message: "Deleted successfully",
            status: 200
        });
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message
        });
        next(error);
    }
};

exports.getProjectType = async (req,res,next) => {
    try{
        const [proType] = await Projects.fetchProjectType(req.body);
        res.status(200).json({
            status:"success",
            statusCode: 200,
            body:proType[0]
        })
    }
    catch(error){
        res.status(500).json({
            status:"failed",
            statusCode:500,
            body: error
        })
    }
}

exports.getFaculty = async (req, res, next) => {
    try{
        [faculties] = await Projects.faculty();
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: faculties[0]
        })
    }
    catch (error) {
        if(!error.statusCode)
            error.statusCode = 500;
        
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: error.message 
        })
    }
    
};

exports.uploadDocs = async (req, res, next) =>{
    if(req.files.SYNOPSIS){
        fs.rename(req.files.SYNOPSIS[0].path, 'docs\\projectUploads\\'+req.body.proId+'-SYNOPSIS'+path.extname(req.files.SYNOPSIS[0].filename), async (err)=>{
            if(err){
            }else{
                synopsis = await Projects.uploadSynopsis({
                    path: 'docs\\projectUploads\\'+req.body.proId+'-SYNOPSIS'+path.extname(req.files.SYNOPSIS[0].filename),
                    proId: req.body.proId
                })
            }
        })
    }
    if(req.files.REPORT){
        fs.rename(req.files.REPORT[0].path, 'docs\\projectUploads\\'+req.body.proId+'-REPORT'+path.extname(req.files.REPORT[0].filename), async (err)=>{
            if(err){
            }else{
                synopsis = await Projects.uploadReport({
                    path: 'docs\\projectUploads\\'+req.body.proId+'-REPORT'+path.extname(req.files.REPORT[0].filename),
                    proId: req.body.proId
                })
            }
        })
    }
    if(req.files.PPT){
        fs.rename(req.files.PPT[0].path, 'docs\\projectUploads\\'+req.body.proId+'-PPT'+path.extname(req.files.PPT[0].filename), async (err)=>{
            if(err){
            }else{
                synopsis = await Projects.uploadPpt({
                    path: 'docs\\projectUploads\\'+req.body.proId+'-PPT'+path.extname(req.files.PPT[0].filename),
                    proId: req.body.proId
                })
            }
        })
    }
    res.status(200).json({
        body: req.files
    })
}

exports.printProjects = async (req, res, next) => {
   const workbook = new exceljs.Workbook();
   const worksheet = workbook.addWorksheet('Projects');
   worksheet.columns = [
       {header:'Project_ID', key:'PRO_ID', width: 10},
       {header:'Project_Title', key:'PRO_TITLE', width: 10},
       {header:'DEPARTMENT', key:'DEPARTMENT', width: 10},
       {header:'LEVEL', key:'LEVEL', width: 10},
       {header:'YEAR', key:'YEAR', width: 10},
       {header:'SEMESTER', key:'SEMESTER', width: 10},
       {header:'PRO_TYPE', key:'PRO_TYPE', width: 10},
       {header:'BATCH', key:'BATCH', width: 10},
       {header:'GUIDE', key:'GUIDE', width: 10},
    //    {header:'SYNOPSIS', key:'SYNOPSIS', width: 10},
    //    {header:'REPORT', key:'REPORT', width: 10},
    //    {header:'PPT', key:'PPT', width: 10},
    //    {header:'DIS_SYNOPSIS', key:'DIS_SYNOPSIS', width: 10},
    //    {header:'DIS_REPORT', key:'DIS_REPORT', width: 10},
    //    {header:'DIS_PPT', key:'DIS_PPT', width: 10},
       {header:'MODIFIED_BY', key:'MODIFIED_BY', width: 10},
       {header:'CREATED_AT', key:'CREATED_AT', width: 10},
       {header:'UPDATED_AT', key:'UPDATED_AT', width: 10},
       {header:'STUDENTS', key:'students', width: 10},
       {header:'TECHNOLOGIES', key:'technologies', width: 10},
   ];
   var count=2;
//    console.log(req.body);
   req.body.forEach(project=>{
        worksheet.insertRow(count, project);
        var stuCount=0;
        project.students.forEach(student=>{
            worksheet.getRow(count+stuCount).getCell('students').value = student.USN
            stuCount+=1;
        })
        if(stuCount==0){
            worksheet.getRow(count+stuCount).getCell('students').value = ""
        }

        var techCount=0;
        project.technologies.forEach(technology=>{
            worksheet.getRow(count+techCount).getCell('technologies').value = technology.TECHNOLOGY
            techCount+=1;
        })
        if(techCount==0){
            worksheet.getRow(count+techCount).getCell('technologies').value = ""
        }

        if(stuCount>techCount){
            count = count + stuCount;
        } else
            count = count + techCount;
   })

   worksheet.getRow(1).eachCell((cell)=>{
       cell.font = {bold:true};
   })

   const data = await workbook.xlsx.writeFile('projects.xlsx');

   res.download('projects.xlsx', 'projects.xlsx', (err)=>{
    if(err){
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body:{}
        })
    }   
   });
}

exports.viewPdf = async (req,res,next) => {
    try {
        var ext = req.body.data.split('.').pop();
        console.log(ext,req.body.data);
        if(fs.existsSync(req.body.data)){
            console.log("hello")
        }
        else{
            console.log("bye")
        }
        // res.status(200).json({
        //     status:"success",
        //     statusCode: 200,
        //     body: URL.createObjectURL(req.body.data)
        // });
        res.download(req.body.data, Date.now()+ext, (err)=>{
            if(err){
                res.status(500).json({
                    status:"failed",
                    statusCode: 500,
                    body:{}
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body:{}
        })
    }
}

exports.addReview = async (req, res, next)=>{
    try{
        const addReview = await Projects.addDescription(req.body.data);
        const newReview = await Projects.getReviews(req.body.data.proID);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: newReview
        });    

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            status: "failed",
            statusCode:500,
            body: e
        });
    }
}

exports.updateReview = async (req, res, next) => {
    try{
        // console.log(req.body.data);
        const result = await Projects.updateReviews(req.body.data);
        const updatedReview = await Projects.getReviews(req.body.data.proID);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: updatedReview
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body: {}
        })
    }
}

exports.deleteReview = async (req,res,next)=>{
    try {
        const deleteReview = await Projects.deleteReview(req.body.data);
        const reviews = await Projects.getReviews(req.body.data.proID);
        // console.log(req.body.data.proID, reviews);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: reviews
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body: {}
        })
    }
}