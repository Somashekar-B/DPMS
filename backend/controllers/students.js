const Students = require('../models/students');
const nodemailer = require('nodemailer');

exports.fetchStudents = async  (req, res, body) => {
    try {

        [allStudents] = await Students.getAllStudents();
    
        res.status(200).json({
            status: "success",
            body: allStudents,
            statusCode: 200
        })
        
    } catch (error) {
        
    }
}

exports.getRegisteredStudents = async(req, res, next) => {
    try {
        // console.log("hello");
        [students] = await Students.registeredStudents();
        res.status(200).json({
            statusCode: 200,
            status:"success",
            body: students
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            status: "failed",
            body: {}
        })
    }
}

exports.registerStudent = async (req,res,next)=>{
    try {
        [student] = await Students.getStudentDetails(req.body.data.usn)
        if(student.length==0){
            result = await Students.registerStudent(req.body.data)
        }else{
            done = await Students.markRegistered(req.body.data.usn);
            result = await Students.tempRegisterStudent(req.body.data)
        }
        
        res.status(200).json({
            status: "success",
            statusCode: 200,
            body: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            status: "success",
            body:{}
        })
    }
}

exports.requestedStudents = async (req,res,next)=>{
    try {
        [tempStudents] = await Students.tempRequests(req.body.guide);
        console.log(tempStudents,"tempS");
        [requests] = await Students.requestedStudents(req.body.guide);
        console.log(requests,"reqs");
        length = requests.length;
        for(var i=0; i<tempStudents.length; i++){
            requests[length+i] = tempStudents[i];
        }
        res.status(200).json({
            statusCode: 200,
            status: "success",
            body: requests
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "success",
            statusCode: 500,
            body: {}
        })
    }
}

exports.approve = async (req, res, next) => {
    try {
        [tempStudent] = await Students.fetchTemp(req.body.usn);
         var result;
        if(tempStudent.length!=0){
            result = await Students.updateTempStudent(req.body);
            result2 = await Students.deleteTemp(req.body.usn);
        }else{
            result = await Students.updateNewStudent(req.body.usn);
        }

        const [student] = await Students.getStudentDetails(req.body.usn);
        console.log(student,"stud");
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'myhobbyprojects80@gmail.com',
                pass:'xwjrucjogzzeopod'
            }
        })

        var mailOptions={
            from: 'myhobbyprojects80@gmail.com',
            to: student[0].EMAIL,
            subject: "DPMS - Account Approved",
            text: `Hello ${student[0].NAME},\n\nYour account to DPMS has been approved..:) \n\n\nGet all projects knowledge as you want and create your own!!`
        }

        transporter.sendMail(mailOptions, function(err, info) {
            if(err){
                console.log(err)
            }
            else{ 
                res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    body: result
                })

            }
        })
        res.status(200).json({
            statusCode: 200,
            status:"success",
            body: result
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: {}
        })
    }
}

exports.reject = async (req, res, next) => {
    try {
        [tempStudent] = await Students.fetchTemp(req.body.usn);
        const [student] = await Students.getStudentDetails(req.body.usn);
        var result;
        if(tempStudent.length!=0){
            result = await Students.deleteTemp(req.body.usn);
            mark = await Students.unmarkRegistered(req.body.usn);
        }else{
            result = await Students.deleteStudent(req.body.usn);
        }
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'myhobbyprojects80@gmail.com',
                pass:'xwjrucjogzzeopod'
            }
        })
        var mailOptions={
            from: 'myhobbyprojects80@gmail.com',
            to: student[0].EMAIL,
            subject: "DPMS - Account Rejected",
            text: `Hello ${student[0].NAME},\n\nYour account to DPMS has been rejected..:( \n\n\nPlease check with your Guide/Mentor and try again with right details`
        }

        transporter.sendMail(mailOptions, function(err, info) {
            if(err){
                console.log(err)
            }
            else{ 
                res.status(200).json({
                    status: "success",
                    statusCode: 200,
                    body: result
                })

            }
        })
        res.status(200).json({
            statusCode: 200,
            status:"success",
            body: result
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "failed",
            statusCode: 500,
            body: {}
        })
    }
}
 