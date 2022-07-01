import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passvalid: boolean;
  passhide: boolean = true;
  conpasshide: boolean = true ;
  success: boolean;
  fail: boolean;
  message: String;
  email: string;
  token: string;
  advSub: boolean;
  data: any;
  userNotFound: boolean;


  constructor(private _Activatedroute:ActivatedRoute, private userServe: UserService) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.email = params.get('email');
      this.token = params.get('token');
  });
  }

  resetPassword = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
    conpass: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
   });

   get password(){return this.resetPassword.get('password')};
   get conpassword(){return this.resetPassword.get('conpass')};

  ngOnInit(): void {
  }


  checkPass(){
    if(this.resetPassword.get('password').value === this.resetPassword.get('conpass').value){
      this.passvalid = true;
    }
    else this.passvalid=false;
  }

  submitData(){
    this.data = {
      email: this.email,
      token: this.token,
      password: this.resetPassword.get('password').value
    }
    this.userServe.resetPassword(this.data).subscribe((res:any)=>{

      if(res.statusCode == 201){
        this.userNotFound = true;
      }
      else if(res.statusCode == 200){
        this.success = true;
      }
    }, err => {
      this.fail = true;
    })


  }

}
