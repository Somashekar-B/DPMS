import { res } from './../models/res.model';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{

  passhide: boolean;
  conpasshide: boolean;
  passvalid: boolean;
  advSub: boolean;
  dep: string;
  success: boolean;
  fail: boolean;
  message: String;
  allUsers:any;
  userFound: boolean;
  mailFound: boolean;
  usr: any;
  localUser: any;
  image:  any;
  formData = new FormData();

  constructor(
    private userServe: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    private sUrl: SharedUrlService) {
    this.passhide=true,
    this.conpasshide=true,
    this.advSub=false,
    this.success=false,
    this.fail = false

   }



   newUser = new FormGroup({
    fname: new FormControl('', [ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%?. ]*')]),
    username: new FormControl('',[ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%?. ]*')]),
    password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
    conpass: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
    mobNo:new FormControl('', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    userType: new FormControl('', Validators.required),
    photo: new FormControl('')
   });

   get fname(){return this.newUser.get('fname')};
   get username(){return this.newUser.get('username')};
   get password(){return this.newUser.get('password')};
   get conpassword(){return this.newUser.get('conpass')};
   get mobNo(){return this.newUser.get('mobNo')};
   get email(){return this.newUser.get('email')};
   get department(){return this.newUser.get('department')};
   get photo(){return this.newUser.get('photo')};
   get userType(){return this.newUser.get('userType')};


   ngOnInit(){

    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body)
      this.userServe.getAllDepUsers().subscribe((result:res)=>{
        this.allUsers = result.body
      })
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../']);
        }
      }
    });


   }

  user: any;
  checkUsername(uname){
      this.user = this.allUsers.filter(function(res){
        return res.USERNAME == uname
      })

    if(this.user.length){
      this.userFound = true;
    }
    else
      this.userFound=false
  }

  mail: any;

  checkEmail(email){
      this.mail = this.allUsers.filter(function(res){
        return res.EMAIL == email
     })

    if(this.mail.length){
      this.mailFound = true;
    }
    else{
      this.mailFound= false
    }
  }

  checkPass(){
    if(this.newUser.get('password').value === this.newUser.get('conpass').value){
      this.passvalid = true;
    }
    else this.passvalid=false;
  }

  handleFIle(event){
    // console.log(event.target.files);
    if(event.target.files.length>0){
       this.image = event.target.files[0]
       this.formData.set('PHOTO', event.target.files[0]);
       console.log(this.formData,"datra")
    }
    // console.log(event.target.files[0], this.image);
  }


  submitData(){

    this.userServe.addUser(this.newUser.value).subscribe((result: res) => {
      if(result.statusCode==200){
        
        this.formData.append('USERNAME', this.newUser.get('username').value);
        
        console.log(this.formData);
        this.userServe.uploadPhoto(this.formData).subscribe((res:res)=>{
          this.dep = this.newUser.value.department;
          this.fail=false;
          this.success=true;
          setTimeout(()=>{
            this.success = false;
          },5000);
          this.message = "You have Successfully Registered a new Admin for " + this.dep + "  Department";
        })
      }
    }, err => {
        this.success=false
        this.fail=true;
        setTimeout(()=>{
          this.fail = false;
        },5000);
        this.message = "Registration failed due to some issues.. :( "
    })

    window.scroll(0,0);

};

}
