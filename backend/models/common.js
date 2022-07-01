const db = require('../util/database');

module.exports = class Common{
    static setIntegrityOff(){
        return db.query("SET FOREIGN_KEY_CHECKS=0");
    }

    static setIntegrityOn(){
        return db.query("SET FOREIGN_KEY_CHECKS=1");
    }
}