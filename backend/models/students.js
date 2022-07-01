const db = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class Students{

    static getAllStudents(){
        return db.query('SELECT * FROM students')
    }

    static getStudentDetails(usn){
        // console.log(usn,"usnn");
        return db.query('SELECT * FROM students WHERE USN = ? OR EMAIL = ?',[usn, usn]);
    }
    
    static getStudents(proId){
        return db.query('SELECT * FROM students S JOIN pro_students PS ON S.USN = PS.USN WHERE PS.PRO_ID = ?',[proId]);
    }

    static insertProStudents(projectID,stuList){
        var res;
        for(var i=0; i<stuList.length; i++){
            res=db.query('INSERT INTO pro_students VALUES(?,?)', [projectID, stuList[i]])
        }
        return res;
    }

    static deleteProStudents(proId){
        return db.query('DELETE FROM pro_students WHERE PRO_ID = ?',[proId])
    }

    static insertStudentInfo(stuList){
        var res;
        stuList.forEach(student => {
            res = db.query('INSERT INTO students(USN,NAME,MOBILE_NO, EMAIL,ACADEMIC_BATCH,PREENTRY) VALUES(?,?,?,?,?,1)',[student.USN, student.NAME, student.MOBILE_NO, student.EMAIL, student.ACADEMIC_BATCH])
        })
        return res;
    }

    static deleteStudentInfo(stuList){
        var res;
        stuList.forEach(student => {
            res = db.query('DELETE FROM students WHERE USN = ?',[student.USN]);
        })
        return res;
    }

    static deleteStudent(usn){
        return db.query('DELETE FROM students WHERE USN = ?',[usn]);
    }

    static updateStudentInfo(stuList){
        var res;
        stuList.forEach(student => {
            res = db.query('UPDATE students SET NAME = ?, MOBILE_NO = ?, EMAIL = ?, ACADEMIC_BATCH = ? WHERE USN = ?',[student.NAME, student.MOBILE_NO, student.EMAIL, student.ACADEMIC_BATCH, student.USN])
           
        })
        return res;
    }
    static markRegistered(usn){
        return db.query('UPDATE students SET REGISTERED = 1 WHERE USN=?',[usn]);
    }

    static unmarkRegistered(usn){
        return db.query('UPDATE students SET REGISTERED = 0 WHERE USN=?',[usn]);
    }

    static registeredStudents(){
        return db.query('SELECT USN, EMAIL FROM students WHERE REGISTERED=1 AND GRANTED = 0');
    }

    static registerStudent(data){
        // console.log(data);
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(data.password, salt, (err, hash) => {
                return db.query('INSERT INTO students(USN, NAME, MOBILE_NO, EMAIL, REGISTERED, PASSWORD, GRANTEDBY) VALUES(?,?,?,?,?,?,?)',[data.usn, data.fname, data.mobNo, data.email, 1, hash, data.guide]);
            })
        })
    }

    static tempRegisterStudent(data){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(data.password, salt, (err, hash) => {
                return db.query('INSERT INTO temp(USN, NAME, MOBILE_NO, EMAIL, PASSWORD, GRANTEDBY) VALUES(?,?,?,?,?,?)',[data.usn, data.fname, data.mobNo, data.email, hash, data.guide]);
            })
        })
    }

    static fetchTemp(data){
        return db.query('SELECT * FROM temp WHERE USN  = ?',[data]);
    }

    static updateTempStudent(data){
        return db.query('UPDATE students SET NAME = ?, MOBILE_NO = ?, EMAIL = ?, GRANTED = 1, PASSWORD = ?, GRANTEDBY = ? WHERE USN = ?',[data.NAME, data.MOBILE_NO, data.EMAIL, data.PASSWORD, data.GRANTEDBY, data.USN]);
    }

    static updateNewStudent(data){
        return db.query('UPDATE students SET GRANTED = 1 WHERE USN = ?',[data])
    }

    static requestedStudents(guide){
        return db.query('SELECT USN, NAME, EMAIL, MOBILE_NO, PHOTO FROM students WHERE GRANTEDBY = ? AND REGISTERED = 1 AND GRANTED = 0 AND USN NOT IN (SELECT USN FROM temp WHERE GRANTEDBY = ?)',[guide, guide]);
    }

    static tempRequests(guide){
        return db.query('SELECT USN, NAME, EMAIL, MOBILE_NO, PHOTO FROM temp WHERE GRANTEDBY = ?',[guide]);
    }

    static markRejected(usn){
        return db.query('UPDATE students SET REGISTERED = 0 WHERE USN = ?',[usn]);
    }

    static deleteTemp(usn){
        return db.query('DELETE FROM temp WHERE USN = ?',[usn]);
    }

    static updateStudentPassword(userdata){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(userdata.password, salt, (err, hash) => {
                return db.query('UPDATE students SET PASSWORD = ? WHERE EMAIL = ?',[hash, userdata.email]);
            })
        })
    }

}