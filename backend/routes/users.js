const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/users');
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
    destination: function(req, file, cb){
        cb(null, 'public/users');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({storage: storage});
var multipleUpload =  upload.fields([{name:'PHOTO', maxCount:1}])


router.post('/', verifyToken, userController.addUser);
router.post('/getallDepUsers', verifyToken, userController.getAllDepUsers);
router.post('/uploadPhoto', multipleUpload, userController.uploadPhoto);
router.post('/getUsersAbstract', userController.extractUsers);
router.post('/getAllUsers', verifyToken, userController.getAllUsers);
router.get('/fetchUser/', verifyToken,userController.getUser);
router.post('/deleteUser', verifyToken, userController.deleteUser);
router.put('/updateUser', verifyToken,userController.updateUser);
router.post('/validateUser', userController.validateUser);
router.post('/forget-password', verifyToken, userController.forgetPassword);
router.post('/details', verifyToken, userController.getDetails);
router.post('/reset-password', verifyToken, userController.resetPassword);
router.post('/updateAccess', verifyToken, userController.updateAccess);

module.exports = router;