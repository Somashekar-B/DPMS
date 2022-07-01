import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { StudentsService } from './../../services/students.service';
import { res } from './../models/res.model';
import { ProjectsService } from 'src/app/services/projects.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  facultyCount: any;
  projectsCount: any;
  studentsCount: any;
  user: any;
  constructor(
    private proService: ProjectsService,
    private stuService: StudentsService,
    private userService: UserService,
    private router: Router,
    private sUrl: SharedUrlService) { }

  ngOnInit(): void {
    this.proService.getFaculty().subscribe((result: res)=> {
      this.facultyCount = result.body.GUIDE

    });

    this.stuService.getAllStudents().subscribe((result: res)=>{
      this.studentsCount = result.body.length
    });

    this.userService.getDetails().subscribe((result:res)=>{
      this.userService.setUser(result.body);
      this.user = result.body;
      if(this.user.USERTYPE == 'Faculty'){
        this.facultyCount = 1;
      }
      this.proService.fetchAllProjects(this.user).subscribe((result: res)=>{
        this.projectsCount = result.body.allProjects.length
      });
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../'])
        }
      }
    });

  }

}
