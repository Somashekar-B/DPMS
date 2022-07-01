const express = require('express');
const projectController = require('../controllers/projects')
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null'){
        return res.status(401).send('Unauthorized request');
    }
    const secret = "everythingGoesSecret";
    let payload;
    jwt.verify(token,secret, (err,payl)=>{
        if(err){
            next(err)
        }else{
            payload = payl;
        }

    });
    if(!payload){
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload;
    next();
}

var storage = multer.diskStorage({
    
    destination: function(req, file,cb){
        cb(null,'public/projectUploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+ '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage: storage})
  
var multipleUpload =  upload.fields([{name:'SYNOPSIS', maxCount:1},{name:'REPORT', maxCount:1},{name:'PPT', maxCount:1}])


router.post('/fetchProjects', verifyToken, projectController.fetchProjects);
router.post('/getProject',verifyToken, projectController.getProject);
router.post('/getProjectTypes',verifyToken, projectController.getProjectTypes);
router.post('/fetchProjectType',verifyToken, projectController.getProjectType);
router.post('/updateProjectType', verifyToken, projectController.updateProjectType);
router.post('/',verifyToken ,projectController.insertProject);
router.post('/updateProject',verifyToken ,projectController.updateProject);
router.post('/getAllTechs',verifyToken ,projectController.getAllTechs);
router.post('/getfaculty', verifyToken ,projectController.getFaculty);
router.post('/addProTypes', verifyToken ,projectController.addProTypes);
router.post('/deleteProject', verifyToken ,projectController.deleteProject);
router.post('/deleteProjectType', verifyToken ,projectController.deleteProjectTypes);
router.post('/uploadDocs',[multipleUpload], projectController.uploadDocs);
router.post('/printProjects',[verifyToken], projectController.printProjects);
router.post('/viewPdf', verifyToken, projectController.viewPdf);
router.post('/addReview', verifyToken, projectController.addReview);
router.post('/updateReview', verifyToken, projectController.updateReview);
router.post('/deleteReview', verifyToken, projectController.deleteReview);

module.exports = router; 