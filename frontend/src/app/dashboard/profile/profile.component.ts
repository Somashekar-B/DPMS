import { ProjectsService } from './../../services/projects.service';
import { SharedUrlService } from './../../services/shared-url.service';
import { UserService } from './../../services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { res } from '../models/res.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('uname') name: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  dep: any;
  success: boolean;
  message: string;
  fail: boolean;
  advSub: boolean;
  localUser: any;
  allUsers: any;
  userFound: boolean;
  mailFound: boolean;
  data:any;
  image: any;
  photoUrl: any


  constructor(
    private us: UserService,
    private router: Router,
    private sUrl: SharedUrlService,
    private proService: ProjectsService,
    private sanitizer: DomSanitizer) {

   }

  newUser = new FormGroup({
    fname: new FormControl('', [ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%? ]*')]),
    username: new FormControl('',[ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%?]*')]),
    mobNo:new FormControl('', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl('')
   });

   get fname(){return this.newUser.get('fname')};
   get username(){return this.newUser.get('username')};
   get password(){return this.newUser.get('password')};
   get conpassword(){return this.newUser.get('conpass')};
   get mobNo(){return this.newUser.get('mobNo')};
   get email(){return this.newUser.get('email')};
   get department(){return this.newUser.get('department')};




  user: any
  ngOnInit(): void {

    this.sUrl.setPreviousUrl(this.router.routerState.snapshot.url)
    this.us.getDetails().subscribe((result:res)=>{
      this.us.setUser(result.body);
      this.us.getAllDepUsers().subscribe((result:res)=>{
        this.allUsers = result.body
      })
      this.user = this.us.userDetail;
      this.newUser.patchValue({
      fname: this.user.NAME,
      username: this.user.USERNAME,
      mobNo: this.user.MOBILE_NO,
      email: this.user.EMAIL,
    });
    this.setProfilePhoto();
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../'])
        }
      }
    })

  }

  handleFIle(event){
    if(event.target.files.length>0){
       this.image = event.target.files[0]
    }
    else{
      this.image = undefined
    }
  }

  returnJpegBlob(res){
    return new Blob([res], {type: 'image/jpeg'});
  }

  returnPngBlob(res){
    return new Blob([res], {type: 'image/png'});
  }

  setProfilePhoto(){
    if(this.user.PHOTO!="" && this.user.PHOTO!=null && this.user.PHOTO!=undefined){
      var ext = this.user.PHOTO.split('.').pop();
      this.proService.viewPdf(this.user.PHOTO).subscribe(res=>{
        var url;
        if(ext=='jpeg'|| ext == 'jpg' || ext=='JPEG' || ext == 'JPG'){
           url = window.URL.createObjectURL(this.returnJpegBlob(res));
        }else if(ext=='png' || ext=='PNG'){
           url = window.URL.createObjectURL(this.returnPngBlob(res));
        }
        this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(url);

      }, err=>{
        this.photoUrl = "/assets/images/undraw_teacher_35j2.png"
      })
    }
    else{
      this.photoUrl = "/assets/images/undraw_teacher_35j2.png"
    }
  }

  updateuser(){
      this.data = this.newUser.value;
      this.data.photo = this.image;
      this.data.olduname = this.us.userDetail.USERNAME;
      this.us.updateUser(this.data).subscribe((result: res) => {
        if(result.statusCode==200){
          var formData = new FormData();
          formData.append('PHOTO', this.image);
          formData.append('USERNAME', this.newUser.get('username').value);

          this.us.uploadPhoto(formData).subscribe((res:res)=>{
            this.us.userDetail = result.body;
            this.success=true;
            setTimeout(()=>{
              this.router.navigate(['../']);
            }, 5000);
            this.fail=false;
            this.message = " Update Successfull and will be redirected to login page in 5 secs"

          })
        }
      }, err => {
        this.fail=true;
        this.success=false;
        setTimeout(()=>{
          this.fail=false;
        },5000);
          this.message = "Updation failed due to some issues.. :( "
      })


  }

  checkUsername(uname){
       var olduname=this.us.userDetail.USERNAME
      this.user = this.allUsers.filter(function(res){
        return uname!=olduname && res.USERNAME == uname
      })

    if(this.user.length){
      this.userFound = true;
    }
    else
      this.userFound=false
  }

  mail: any;

  checkEmail(email){
    var oldemail=this.us.userDetail.EMAIL;
      this.mail = this.allUsers.filter(function(res){
        return email!=oldemail && res.EMAIL == email
      })

    if(this.mail.length){
      this.mailFound = true;
    }
    else{
      this.mailFound= false
    }
  }

}
