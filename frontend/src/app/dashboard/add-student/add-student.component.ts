import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';
import { res } from '../models/res.model';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  passhide: boolean;
  conpasshide: boolean;
  passvalid: boolean;
  advSub: boolean;
  dep: string;
  success: boolean;
  fail: boolean;
  message: String;
  userFound: boolean;
  mailFound: boolean;
  usr: any;
  localUser: any;
  image:  any;
  formData = new FormData();
  allStus: any;
  allUsers: any;
  mySubscription: any;

  constructor(
    private stuServe: StudentsService, 
    private userServe: UserService, 
    private route: ActivatedRoute, 
    private router: Router
    ) { this.router.routeReuseStrategy.shouldReuseRoute = function () {
    return false;
  };

  this.mySubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.router.navigated = false;
    }
  }); }

  ngOnInit(): void {
    this.stuServe.getRegisteredStudents().subscribe((result:res)=>{
      this.allStus = result.body;
    })
    this.userServe.getUsersAbstract("CS").subscribe((result:res)=>{
      this.allUsers = result.body;
    })
    
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  newUser = new FormGroup({
    fname: new FormControl('', [ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%?. ]*')]),
    usn: new FormControl('',[ Validators.required, Validators.pattern('[a-zA-Z0-9@#$%?. ]*')]),
    password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
    conpass: new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
    mobNo:new FormControl('', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    // department: new FormControl('', Validators.required),
    guide: new FormControl('', [Validators.required]),
    photo: new FormControl('')
   });

   get fname(){return this.newUser.get('fname')};
   get usn(){return this.newUser.get('usn')};
   get password(){return this.newUser.get('password')};
   get conpassword(){return this.newUser.get('conpass')};
   get mobNo(){return this.newUser.get('mobNo')};
   get email(){return this.newUser.get('email')};
   get guide(){return this.newUser.get('guide')};
  //  get department(){return this.newUser.get('department')};
   get photo(){return this.newUser.get('photo')};

   
  user: any;
  checkusn(usn){
    
      this.user = this.allStus.filter(function(res){
        return res.USN.to == usn
      })
      console.log(this.user);

    if(this.user.length){
      this.userFound = true;
    }
    else
      this.userFound=false
  }

  mail: any;

  checkEmail(email){
      this.mail = this.allStus.filter(function(res){
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

  back(){
    this.router.navigate(['../']);
  }


  submitData(){
    // console.log(this.newUser.value);

    this.stuServe.registerStudent(this.newUser.value).subscribe((result:res)=>{
      if(result.statusCode==200){
        this.fail=false;
          this.success=true;
          setTimeout(()=>{
            this.success = false;
          },20000);
          var response = confirm('Your Account is sent for Guide Aprooval please wait until its been verified. Please contact your guide');
          if(response || !response)
            this.router.navigate(['../create-student-account']);
          // this.message = "You have Successfully Registered a new Admin for " + this.dep + "  Department";
      }
     }, err => {
        this.success=false
        this.fail=true;
        setTimeout(()=>{
          this.fail = false;
        },5000);
        this.message = "Registration failed due to some issues.. :( "
      });
    // this.userServe.addUser(this.newUser.value).subscribe((result: res) => {
    //   if(result.statusCode==200){
        
    //     this.formData.append('USERNAME', this.newUser.get('username').value);
        
    //     console.log(this.formData);
    //     this.userServe.uploadPhoto(this.formData).subscribe((res:res)=>{
    //       this.dep = this.newUser.value.department;
    //       this.fail=false;
    //       this.success=true;
    //       setTimeout(()=>{
    //         this.success = false;
    //       },5000);
    //       this.message = "You have Successfully Registered a new Admin for " + this.dep + "  Department";
    //     })
    //   }
    // }, err => {
    //     this.success=false
    //     this.fail=true;
    //     setTimeout(()=>{
    //       this.fail = false;
    //     },5000);
    //     this.message = "Registration failed due to some issues.. :( "
    // })

    window.scroll(0,0);

};


}
