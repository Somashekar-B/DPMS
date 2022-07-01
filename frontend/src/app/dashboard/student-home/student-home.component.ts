import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { StudentsService } from 'src/app/services/students.service';
import { SharedUrlService } from 'src/app/services/shared-url.service';
import { UserService } from 'src/app/services/user.service';
import { res } from '../models/res.model';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  allProjects: any;
  data: any = {};
  user: any;
  temp: any;
  myProjects: boolean=false;
  email: any;
  token: any;
  totalProjects: Number;
  filteredProjects: Number;

  constructor(private sUrl: SharedUrlService, private stuService: StudentsService, private proService: ProjectsService, private userServe: UserService, private router: Router) { }

  ngOnInit(): void {
    this.data.USERTYPE = "Student";
    this.data.DEP_CODE = "CS";
    this.sUrl.setPreviousUrl(this.router.routerState.snapshot.url);
    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      // console.log(result.body);
      this.user = result.body;
      this.proService.fetchAllProjects(this.data).subscribe((result:res)=>{
        this.allProjects  = result.body.allProjects;
        this.totalProjects = this.allProjects.length;
        this.filteredProjects = this.allProjects.length;
        this.temp = result.body.allProjects;
        this.email = this.userServe.userDetail.EMAIL;
        this.token = this.userServe.getToken();
        console.log(this.email, this.token);
        
      })
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../'])
        }
      }
    })

    
  }

  getStudentProjects(){
    this.myProjects = true;
    //this.allProjects = [];
    this.allProjects = this.temp.filter((project)=>{
      return project.students.filter(e => e.USN.toString() === this.user.USN.toString()).length
    })
  }

  getAllProjects(){
    this.myProjects = false;
    this.allProjects = [];
    this.temp.forEach((pro)=>{
      this.allProjects.push(pro);
    });
  }

  search(event){
    var text = event.target.value.toLowerCase();
    this.allProjects = this.temp.filter((pro)=>{
      return pro.PRO_TITLE.toLowerCase().includes(text)
            ||pro.PRO_ID.toLowerCase().includes(text)
            ||pro.PRO_TYPE.toLowerCase().includes(text)
            ||pro.GUIDE.toLowerCase().includes(text)
            ||pro.YEAR.toString().toLowerCase().includes(text)
            ||pro.technologies.some((tech)=>tech.TECHNOLOGY.toLowerCase().includes(text));
            
    });

    this.filteredProjects = this.allProjects.length;
  }

  logout(){
    this.userServe.logout();
    this.router.navigate([''])
  }

}
