import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { SharedUrlService } from './../../services/shared-url.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  previousUrl: string;
  mail: string="";
  mailNotFound: boolean;
  success: boolean;
  fail: boolean;

  constructor(private sUrl: SharedUrlService, private router: Router, private userServe: UserService) {
    if(this.userServe.userLogged){
      this.mail = this.userServe.userDetail.EMAIL;
    }

  }

  forgotPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get email(){return this.forgotPassword.get('email')};

  ngOnInit(): void {
    this.sUrl.previousUrl$.subscribe(arg => {
      this.previousUrl = '..' + arg;
   })
   this.email.setValue(this.mail)
  }

  returnBack(){
    this.router.navigate([this.previousUrl]);
  }

  submitData(){

        this.success = false;
        this.fail=false;
        this.mailNotFound = false
     this.userServe.forgetPassword(this.email.value).subscribe((result:any)=>{

      if(result.statusCode == 201){
        this.mailNotFound = true
        this.success = false
        this.fail=false;
      }
      if(result.statusCode == 200){
        this.success = true
        setTimeout(()=>{
          this.success = false;
        },5000);
        this.fail=false;
        this.mailNotFound = false
      }
    }, err=>{
      this.fail = true
      setTimeout(()=>{
        this.fail = false;
      },5000);
      this.success = false
      this.mailNotFound = false
    })
  }

}


