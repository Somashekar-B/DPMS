const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Departments = require('../models/departments');
const fs = require('fs');
const path = require('path');
const Students = require('../models/students');

const JWT_SECRET = "Its Really";

exports.validateUser = async (req, res, next) => {
    try {
        
        [users] = await Users.getUser(req.body.username);
        
        if(users.length == 0){
            [students] = await Students.getStudentDetails(req.body.username);
            if(students.length==0){
                res.status(201).json({
                    status: "failed",
                    statusCode: 201,
                    body: {}
                });
            }
            else{
                
                if(students[0].GRANTED == 1){
                    bcrypt.compare(req.body.password, students[0].PASSWORD, function(err, result){
                        if(err){
                            console.log(err);
                        }
                        if(result){
                            const payload = {
                                NAME: students[0].NAME,
                                USN: students[0].USN,
                                DEP_CODE: students[0].DEP_CODE,
                                EMAIL: students[0].EMAIL,
                                MOBILE_NO: students[0].MOBILE_NO,
                                PHOTO: students[0].PHOTO,
                            }
                            
                            const secret = "everythingGoesSecret";
                            token = jwt.sign(payload, secret);
                            
                            // console.log(token);
                            res.status(200).json({
                                status: "success",
                                statusCode: 202,
                                body: token
                            });
                        }
                    });
                }else if(students[0].REGISTERED==1){
                    res.status(401).json({
                        status: "Account not yet verified please contact your Guide/Mentor",
                        statusCode: 203,
                        body: {}
                    });
                }else{
                    res.status(500).json({
                        status: "Account not found..!",
                        statusCode: 500,
                        body: {}
                    });
                }
            }
        }
        else{
            const [dep] = await Departments.getDepartment(users[0].DEP_CODE);
            
            bcrypt.compare(req.body.password,users[0].PASSWORD,function(err, result){
                if(result){   
                    users[0].DEPARTMENT = dep[0].DEPARTMENT;
                    const payload = {
                        NAME: users[0].NAME,
                        USERNAME : users[0].USERNAME,
                        DEPARTMENT: users[0].DEPARTMENT,
                        DEP_CODE: users[0].DEP_CODE,
                        EMAIL: users[0].EMAIL,
                        MOBILE_NO: users[0].MOBILE_NO,
                        PHOTO: users[0].PHOTO,
                        USERTYPE: users[0].USERTYPE
                    };
                    const secret = "everythingGoesSecret";
                    token = jwt.sign(payload, secret);

                    res.status(200).json({
                        status: "success",
                        statusCode: 200,
                        body: token
                    })
                }
                
                else{
                    res.status(200).json({
                        status: "failed",
                        statusCode: 500,
                        body: {}
                    })
                }                
            })
            
        }
    }  catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        next(error);
    }
} 

exports.addUser = async (req, res, next) => {
    try {
        var user = await Users.addUser(req.body);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: user
        })
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500
        }
        res.status(500).json({
            status: "fail",
            statusCode: 500,
            body: {}
        })

        next(error);
    }
}

exports.extractUsers = async (req, res, next) => {
    try {

        [users] = await Users.getUserAbstract(req.body.department);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: users
        });
        
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500
        
        next(error);
    }
}

exports.getAllUsers = async (req,res,next)=>{
    try {
        [users] = await Users.getAllUsers(req.body.department);
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: users
        });
        
    } catch (error) {
        console.log(error)
        if(!error.statusCode)
            error.statusCode = 500
        
        next(error);
    }
}

exports.getAllDepUsers = async (req, res, next) =>{
    try {
        [users] =await Users.getAllDepartmentUsers();
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: users
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: {}
        })
    }
}

exports.getUser = async (req, res, next) => {
    try {
        [user] = await Users.getUser(req.query.uname);
        [dep] = await Departments.getDepartment(user.DEP_CODE);
        user.DEPARTMENT = dep[0].DEPARTMENT;
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: user[0]
        })
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500
        
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        // const off = await Common.setIntegrityOff();
        result = await Users.updateUser(req.body);
        [user] = await Users.getUser(req.body.username);
       if(req.body.photo){
           if(fs.existsSync('public\\users\\'+req.body.oldname)){
               fs.unlink('public\\users\\'+req.body.oldname, (err)=>{
                   if(err){
                       next(err)
                   }
                   else{
                       
                   }
               })
           }
       }
       else{
           if(user[0].PHOTO){
               fs.rename(user[0].PHOTO,'public\\users\\'+req.body.username+path.extname(user[0].PHOTO), async (err)=>{
                   if(err){
                       next(err)
                   }
                   else{
                       try{
                        photo = await Users.uploadPhoto({
                            path: 'public\\users\\'+req.body.username+path.extname(user[0].PHOTO),
                            username: req.body.username
                        });
                    }
                    catch(err){
                        next(err);
                    }
                   }
               })
           }
       }
        // const on = await Common.setIntegrityOn();
        res.status(200).json({
            status:"success",
            statusCode: 200,
            body: user[0]
        })
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500
    }
}

exports.deleteUser = async (req,res,next) => {
    try{
        // const off = await Common.setIntegrityOff();
        result = await Users.deleteUser(req.body.delUname);
        // const on = await Common.setIntegrityOn();
        if(result[0].affectedRows != 0){
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'sdmcetcseprojects@gmail.com',
                    pass:'tqepcbpyasvtvbmz'
                }
            })

            var mailOptions={
                from: 'sdmcetcseprojects@gmail.com',
                to: req.body.delEmail,
                subject: "DPMS - Account Deleted",
                text: `Your DPMS account has been removed by ${req.body.name} with email id ${req.body.email}`
            }

            transporter.sendMail(mailOptions, function(err, info) {
                if(err){
                    return res.status(404).json({
                        status: "failed",
                        statusCode: 500,
                        body: {}
                    })
                }
                else{ 
                    res.status(200).json({
                        status: "success",
                        statusCode: 200,
                        body: {}
                    })
                }
            })  
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            status:"failed",
            statusCode: 500,
            body: err.message
        })
    }
}

exports.forgetPassword = async (req, res, next) => {
    try {
        [user] = await Users.getMail(req.body.email);
        if(user.length==0){
            res.status(201).json({
                status: "User not found",
                statusCode: 201,
                body: {}
            })
        }
        else{
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'sdmcetcseprojects@gmail.com',
                    pass: 'tqepcbpyasvtvbmz'
                }
            })

           
            const secret = JWT_SECRET + user[0].PASSWORD;
            const payload = {
                email: user[0].EMAIL
            }

            const token = jwt.sign(payload, secret, {expiresIn: '15m'})
            const link = `http://192.168.69.47:4200/reset-password/${user[0].EMAIL}/${token}`
            
            var mailOptions={
                from: 'sdmcetcseprojects@gmail.com',
                to: req.body.email,
                subject: "DPMS - Password Reset Link",
                text: `Use the following link to reset the password it is valid for 15 minutes \n\n ${link}`
            }

            transporter.sendMail(mailOptions, function(err, info) {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        status: "failed",
                        statusCode: 500,
                        body: {}
                    })
                }
                else{ 
                    res.status(200).json({
                        status: "success",
                        statusCode: 200,
                        body: {}
                    })

                }
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: {}
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        [user] = await Users.getMail(req.body.email);
        if(user.length==0){
            res.status(201).json({
                status: "User not found",
                statusCode: 201,
                body: {}
            })
        }

        else{
            const secret = JWT_SECRET + "" + user[0].PASSWORD;
            
            try {
                const payload = jwt.verify(req.body.token, secret)
                const [user] = await Users.getUser(req.body.email)
                var result;
                if(user.length!=0)
                    result = Users.updateUserPassword(req.body);
                else{
                    result = Students.updateStudentPassword(req.body);
                }
                res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    body: result
                }) 

            } catch (error) {
                console.log(error)
                if(!error.statusCode)
                    error.statusCode = 500
                res.status(500).json({
                    staus: "Failed",
                    statusCode: 500,
                    body: {}
                })

                res.send();
                
            }
        }

    } catch (error) {
        return res.status(500).json({
            staus: "Failed",
            statusCode: 500,
            body: {}
        })
    }
}

exports.getDetails = (req, res) => {
        res.status(200).json({
            staus:"success",
            statusCode: 200,
            body: req.userId
        })
}

exports.uploadPhoto = async (req, res, next) => {
    console.log(req.body);
    if(req.files.PHOTO){
        fs.rename(req.files.PHOTO[0].path, 'public\\users\\'+req.body.USERNAME+path.extname(req.files.PHOTO[0].filename), async (err) =>{
            if(err){
            }else{
                try{
                    photo = await Users.uploadPhoto({
                        path: 'public\\users\\'+req.body.USERNAME+path.extname(req.files.PHOTO[0].filename),
                        username: req.body.USERNAME
                    });
                }
                catch(err){
                    next(err);
                }
            }
        })
    }
    res.status(200).json({
        body: req.files
    })
}

exports.updateAccess = async (req, res, next) => {
    try {
        [user] = await Users.getMail(req.body.data.email);
        if(user.length==0){
            res.status(201).json({
                status: "User not found",
                statusCode: 201,
                body: {}
            })
        }

        else{
            const update = await Users.updateAccess(req.body.data);
            const [updatedUsers] = await Users.getUserAbstract(req.body.data.DEPARTMENT);
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'sdmcetcseprojects@gmail.com',
                    pass:'tqepcbpyasvtvbmz'
                }
            })

            var mailOptions={
                from: 'sdmcetcseprojects@gmail.com',
                to: req.body.data.email,
                subject: "DPMS - Access Change Update",
                text: `Hello ${req.body.data.name},\n\nYour Access to DPMS portal has changed from ${req.body.data.oldAccess} to ${req.body.data.newAccess} by ${req.body.data.admin}`
            }

            transporter.sendMail(mailOptions, function(err, info) {
                if(err){
                    console.log(err)
                }
                else{ 
                    res.status(200).json({
                        status: "success",
                        statusCode: 200,
                        body: updatedUsers
                    })

                }
            })

            res.status(200).json({
                status: "success",
                statusCode: 200.,
                body: updatedUsers
            })
        }

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            staus: "failed",
            statusCode: 500,
            body: {}
        })
    }
}