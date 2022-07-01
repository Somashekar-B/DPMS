const db = require('../util/database');

module.exports = class Projects{
    
 static fetchAll(depCode){
     return db.query('SELECT * FROM projects WHERE DEPARTMENT = ?',[depCode]);
 }

 static fetchAllOfFaculty(data){
  return db.query('SELECT * FROM projects WHERE DEPARTMENT = ? AND GUIDE = ?',[data.DEP_CODE, data.NAME]);
 }

 static getProject(proId){
    return db.query('SELECT * FROM projects WHERE PRO_ID = ?',[proId]);
 }

 static updateProject(item){
     return db.query('UPDATE projects SET PRO_ID = ?, PRO_TITLE = ?, DEPARTMENT = ?, LEVEL = ?, YEAR = ?, PRO_TYPE = ?, SEMESTER = ?, BATCH = ?, GUIDE = ?, DIS_SYNOPSIS = ?, DIS_REPORT = ?, MODIFIED_BY = ?, UPDATED_AT=? WHERE PRO_ID = ?',
                    [item.PRO_ID ,item.PRO_TITLE, item.DEPARTMENT, item.LEVEL, item.YEAR, item.PRO_TYPE, item.SEMESTER, item.BATCH, item.GUIDE, item.DIS_SYNOPSIS, item.DIS_REPORT, item.uname, item.UPDATED_AT, item.OLD_PRO_ID])
 }

  static insertProject(project){
    return db.query('INSERT INTO projects(PRO_ID, PRO_TITLE, DEPARTMENT, LEVEL, YEAR, SEMESTER, PRO_TYPE, BATCH, GUIDE, SYNOPSIS, REPORT, PPT, DIS_SYNOPSIS, DIS_REPORT, DIS_PPT, MODIFIED_BY, CREATED_AT, UPDATED_AT) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [project.PRO_ID, project.PRO_TITLE, project.DEPARTMENT, project.LEVEL, project.YEAR, project.SEMESTER, project.PRO_TYPE, project.BATCH, project.GUIDE, project.SYNOPSIS, project.REPORT, project.PPT, project.DIS_SYNOPSIS, project.DIS_REPORT, project.DIS_PPT, project.uname, project.CREATED_AT, null])
  }

  static deleteProject(proId){
    return db.query('DELETE FROM projects WHERE PRO_ID = ?',[proId]);
  }

  static fetchTechnologies(proId){
    return db.query("SELECT TECHNOLOGY FROM pro_tech WHERE PRO_ID = ?", [proId]);
  }

  static getAllTechnologies(){
    return db.query("SELECT DISTINCT technology FROM pro_tech");
  }

  static getAllProjectTypes(){
    return db.query("SELECT * FROM project_types");
  }
  
  static getProjectTypes(dep){
    return db.query("SELECT * FROM project_types WHERE DEPARTMENT = ?",[dep]);
  }

  static faculty(){
    return db.query("SELECT COUNT(DISTINCT GUIDE) AS GUIDE FROM projects");
  }

  static addProjectTypes(data){
    return db.query("INSERT INTO project_types VALUES(?,?,?,?,?,?)", [data.TYPE_NAME, data.TYPE_CODE, data.DEPARTMENT, data.SEMESTER, data.LEVEL, data.AVAIL_BATCHES])
  }

  static addProTechs(proId, techs){
    var res;
    techs.forEach(tech => {
      res = db.query("INSERT INTO pro_tech VALUES(?,?)", [proId, tech])   
    });
    return res;
  }

  static updateProTechs(proId, techs){
    var res;
    techs.forEach(tech => {
      res = db.query("INSERT INTO pro_tech VALUES(?,?)", [proId, tech.TECHNOLOGY])   
    });
    return res;
  }

  static deleteProTech(proId){
    return db.query('DELETE FROM pro_tech WHERE PRO_ID = ?',[proId])
  }

  static deleteProType(data){
    return db.query('DELETE FROM project_types WHERE (TYPE_CODE = ? AND 	SEMESTER = ? AND LEVEL = ?)',[data.TYPE_CODE, data.SEMESTER, data.LEVEL]);
  }

  static fetchProjectType(data){
    return db.query("SELECT * FROM project_types WHERE (TYPE_CODE = ? AND LEVEL = ?)",[data.TYPE_CODE, data.LEVEL]);
  }

  static updateProjectType(data){
    return db.query('UPDATE project_types SET TYPE_CODE=?, TYPE_NAME = ?, DEPARTMENT = ?, LEVEL = ?, SEMESTER = ?, AVAIL_BATCHES = ? WHERE (TYPE_CODE = ? AND LEVEL = ?)', [data.TYPE_CODE, data.TYPE_NAME, data.DEPARTMENT, data.LEVEL, data.SEMESTER, data.AVAIL_BATCHES, data.OLD_TYPE_CODE, data.OLD_LEVEL]);
  }

  static getProTech(proId){
    return db.query('SELECT * FROM pro_tech WHERE PRO_ID = ?', [proId]);
  }

  static uploadSynopsis(data){
    return db.query('UPDATE projects SET SYNOPSIS = ? WHERE PRO_ID = ?',[data.path, data.proId]);
  }

  static uploadReport(data){
    return db.query('UPDATE projects SET REPORT = ? WHERE PRO_ID = ?',[data.path, data.proId]);
  }

  static uploadPpt(data){
    return db.query('UPDATE projects SET PPT = ? WHERE PRO_ID = ?',[data.path, data.proId]);
  }

  static addDescription(data){
    return db.query('INSERT INTO project_reviews VALUES(?,?,?) ',[data.proID, data.label, data.description]);
  }

  static getReviews(data){
    // console.log(data+'fadada');
    return db.query('SELECT * FROM project_reviews WHERE PROJECT_ID = ?',[data]);
  }

  static updateReviews(data){
    return db.query('UPDATE project_reviews SET LABEL = ?, DESCRIPTION = ? WHERE PROJECT_ID = ? AND LABEL = ?',[data.label, data.description, data.proID, data.oldLabel]);
  }

  static deleteReview(data){
    return db.query('DELETE FROM project_reviews WHERE PROJECT_ID = ? AND LABEL =?',[data.proID, data.label]);
  }
};

