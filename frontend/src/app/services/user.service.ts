import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  userDetail:any;
  userLogged = false;
  // http://localhost:3000
  private url = "http://192.168.69.47:3000/users"
  // private url ="users"

  isLogged(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getDetails(){
    return this.http.post(this.url+'/details', {});
  }

  addUser(user){
    return this.http.post(this.url, user)
  }

  getUsersAbstract(department){
    return this.http.post(this.url+'/getUsersAbstract',{"department": department});
  }

  getAllUsers(department){
    return this.http.post(this.url+'/getAllUsers',{"department": department});
  }

  getAllDepUsers(){
    return this.http.post(this.url+'/getallDepUsers', {});
  }

  getUser(username){
    return this.http.get(this.url+'/fetchUser/', {
      params:{'uname': username}
    });
  }

  updateUser(newData){
    return this.http.put(this.url +'/updateUser', newData)
  }

  validateUser(userData){
    return this.http.post(this.url+'/validateUser', userData);
  }

  setUser(userData){
    this.userDetail = userData;
    this.userLogged = true;
  }

  logout(){
    this.userDetail = {};
    this.userLogged = false;
    localStorage.removeItem('token');
  }

  forgetPassword(mail){
    return this.http.post(this.url+'/forget-password', {email: mail});
  }

  resetPassword(data){
    return this.http.post(this.url+'/reset-password', data);
  }

  deleteUser(data){
    return this.http.post(this.url+'/deleteUser', data);
  }

  uploadPhoto(data){
    return this.http.post(this.url+'/uploadPhoto', data);
  }

  changeAccess(data){
    return this.http.post(this.url+'/updateAccess', {data});
  }

}
