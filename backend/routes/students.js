const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students')
const jwt = require('jsonwebtoken');

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


router.get('/getAllStudents',verifyToken ,studentsController.fetchStudents);
router.post('/getRegisteredStudents', studentsController.getRegisteredStudents);
router.post('/registerStudent', studentsController.registerStudent);
router.post('/requestedStudents', verifyToken, studentsController.requestedStudents);
router.post('/approve', verifyToken, studentsController.approve);
router.post('/reject', verifyToken, studentsController.reject);

module.exports = router;