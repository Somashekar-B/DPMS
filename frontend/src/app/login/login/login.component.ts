import { SharedUrlService } from './../../services/shared-url.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { res } from '../../dashboard/models/res.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  passhide: boolean;
  conpasshide: boolean;
  advSub: boolean;
  success: boolean;
  fail: boolean;
  message: String;
  userFound: boolean = true;
  mailFound: boolean;
  usr: any;
  localUser: any;


  constructor(private userServe: UserService, private router: Router, private sUrl: SharedUrlService) {
    this.passhide=true,
    this.conpasshide=true,
    this.advSub=false,
    this.success=false,
    this.fail = false

   }

   userLogin = new FormGroup({
    username: new FormControl('',[ Validators.required]),
    password: new FormControl('', [Validators.required])
   });

   get username(){return this.userLogin.get('username')};
   get password(){return this.userLogin.get('password')};


   ngOnInit(){
      this.sUrl.setPreviousUrl(this.router.routerState.snapshot.url);
      // if(this.userServe.isLogged()){
      //   this.router.navigate(['dashboard']);
      // }
   }

  submitData(){
    console.log(this.userLogin.value);
    this.userServe.validateUser(this.userLogin.value).subscribe((result: res) => {
      console.log(result,"result");
      if(result.statusCode==200){
        localStorage.setItem('token',result.body);
        this.router.navigate(['dashboard']);
      }else if(result.statusCode==202){
        localStorage.setItem('token',result.body);
        this.router.navigate(['projects-blog']);
      }
      else if(result.statusCode == 201){
        this.userFound = false;
        this.fail = false;
      }
      else{
        this.userFound = true;
        this.fail = true;
      }
    }, err=>{
      console.log(err);
      this.userFound = false;
      this.fail = false;
      console.log(err);
    })
  }

}
