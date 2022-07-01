// import { res } from './../dashboard/models/res.model';
// import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { project } from '../dashboard/models/project.model';
// import { Observable} from 'rxjs';
// import {catchError, tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // http://localhost:3000
  private url = " http://192.168.69.47:3000/projects";
  // private url = "projects";

  constructor( private http: HttpClient) { }

  projects: any;

  fetchAllProjects(data)  {
    console.log(data);
    // return this.http.get(this.url, {responseType: "json"})
    return this.http.post(this.url + '/fetchProjects', {data})
  };

  addProject(body){
    return this.http.post(this.url, body)
  };

  updateProject(body){
    return this.http.post(this.url+'/updateProject',body)
  }

  deleteProject(proId){
    return this.http.post(this.url + '/deleteProject', {"proId":proId});
  }

  getProject(proId){
    return this.http.post(this.url + '/getProject/', {"proId":proId});
  }

  getAllTechs(){
    return this.http.post(this.url + '/getAllTechs', {})
  };

  addProTypes(data){
    return this.http.post(this.url + '/addProTypes', data);
  }

  getProjectTypes(){
    return this.http.post(this.url+'/getProjectTypes',{})
  }

  fetchProjectType(level,typecode){
    return this.http.post(this.url+'/fetchProjectType',{
      "LEVEL":level,
      "TYPE_CODE":typecode
    })
  }

  deleteProjectType(data){
    return this.http.post(this.url + '/deleteProjectType', data);
  }

  updateProjectType(data){
    return this.http.post(this.url+'/updateProjectType', data);
  }

  getFaculty(){
    return this.http.post(this.url+'/getFaculty', {})
  }

  uploadDocs(data){
    return this.http.post(this.url+'/uploadDocs', data);
  }

  printProjects(data){
    console.log(data,"daaaa")
    return this.http.post(this.url+'/printProjects', data, {responseType: "blob"});
  }

  viewPdf(data){
    return this.http.post(this.url+'/viewPdf', {data}, {responseType: "blob"});
  }

  addReview(data){
    return this.http.post(this.url+'/addReview', {data});
  }

  updateReview(data){
    return this.http.post(this.url+'/updateReview', {data});
  }
  
  deleteReview(data){
    return this.http.post(this.url+'/deleteReview', {data});
  }
}
