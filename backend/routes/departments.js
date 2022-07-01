const express = require('express');
const router = express.Router();
const departmentControllers = require('../controllers/departments');
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
            next(err);
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

router.get('/',verifyToken ,departmentControllers.getDepartments);
router.post('/',verifyToken , departmentControllers.addDepartment);
router.put('/',verifyToken , departmentControllers.updateDepartment);
router.delete('/:depCode',verifyToken , departmentControllers.deleteDepartment);

module.exports = router; 