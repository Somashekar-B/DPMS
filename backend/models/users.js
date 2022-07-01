const db = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class Users{
    static addUser(userData){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(userData.password, salt, (err, hash) => {
                return db.query('INSERT INTO users(NAME, USERNAME, PASSWORD, MOBILE_NO, EMAIL, DEP_CODE, USERTYPE) VALUES(?,?,?,?,?,?,?)',[userData.fname, userData.username, hash, userData.mobNo, userData.email, userData.department, userData.userType]);
            })
        })
    }

    static updateUser(userData){
        return db.query('UPDATE users SET NAME = ?, USERNAME = ?, MOBILE_NO = ?, EMAIL =  ? WHERE USERNAME = ?',[userData.fname, userData.username, userData.mobNo, userData.email, userData.olduname]);
    }

    static deleteUser(uname){
        return db.query("DELETE FROM users WHERE USERNAME = ?",[uname])
    }

    static updateUserPassword(userdata){
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(userdata.password, salt, (err, hash) => {
                return db.query('UPDATE users SET PASSWORD = ? WHERE EMAIL = ?',[hash, userdata.email]);
            })
        })
    }

    static getUserAbstract(dep){
        return db.query('SELECT NAME, EMAIL FROM users WHERE DEP_CODE = ?',[dep]);
    }

    static getAllDepartmentUsers(){
        return db.query('SELECT USERNAME, EMAIL FROM users');
    }

    static getUser(data){
        return db.query('SELECT * FROM users WHERE (USERNAME = ? OR EMAIL = ?)',[data,data]);
    }

    static getMail(mail){
        return db.query('SELECT * FROM users WHERE EMAIL = ?',[mail]);
    }

    static uploadPhoto(data){
        return db.query('UPDATE users SET PHOTO = ? WHERE USERNAME = ?',[data.path, data.username]);
    }

    static updateAccess(data){
        return db.query('UPDATE users SET USERTYPE = ? WHERE EMAIL = ?',[data.newAccess, data.email]);
    }

    static getAllUsers(data){
        return db.query('SELECT NAME, MOBILE_NO, EMAIL, DEP_CODE, USERTYPE FROM users WHERE DEP_CODE = ?',[data])
    }

}