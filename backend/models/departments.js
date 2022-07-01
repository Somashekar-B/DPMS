const db = require('../util/database');

module.exports = class Departments {
    
    static getDepartments(){
        return db.query('SELECT * FROM departments');
    }

    static getDepartment(depCode){
        return db.query("SELECT * FROM departments WHERE DEP_CODE = ?",[depCode])
    }

    static addDepartment(item){
        return db.execute('INSERT INTO departments (dep_code, department) VALUES(?,?)',[item.depCode, item.dname]);
    }

    static updateDepartment(item){
        return db.execute('UPDATE departments SET department = ? WHERE dep_code = ?',[item.dname, item.depCode]);
    }

    static deleteDepartment(depCode){
        return db.execute('DELETE FROM departments WHERE dep_code = ?',[depCode]);
    }
};