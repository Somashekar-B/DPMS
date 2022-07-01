import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }
  // http://localhost:3000
  url = "http://192.168.69.47:3000/students"
  // private url = "";

  getAllStudents(){
    return this.http.get(this.url + '/getAllStudents');
  }

  getRegisteredStudents(){
    return this.http.post(this.url+'/getRegisteredStudents',{});
  }

  registerStudent(data){
    return this.http.post(this.url+'/registerStudent', {data});
  }

  requestedStudents(data){
    return this.http.post(this.url+'/requestedStudents', {guide:data});
  }

  approve(usn){
    return this.http.post(this.url+'/approve',{usn});
  }

  reject(usn){
    return this.http.post(this.url+'/reject', {usn});
  }

}
