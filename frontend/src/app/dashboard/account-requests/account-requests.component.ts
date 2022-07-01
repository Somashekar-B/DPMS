import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SharedUrlService } from 'src/app/services/shared-url.service';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';
import { res } from '../models/res.model';

@Component({
  selector: 'app-account-requests',
  templateUrl: './account-requests.component.html',
  styleUrls: ['./account-requests.component.css']
})
export class AccountRequestsComponent implements OnInit {
  allUsers: any;
  @ViewChild (DataTableDirective)
  dtElement : DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions: any = {};
  mySubscription: any;

  constructor(
    private userServe: UserService, 
    private stuServe: StudentsService,
    private router: Router,
    private sUrl: SharedUrlService
    ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      this.stuServe.requestedStudents(this.userServe.userDetail.NAME).subscribe((result: res) => {
        this.allUsers = result.body;
        console.log(this.allUsers)
        this.dtTrigger.next()
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          dom: 'Bfrtip',
        };
      })
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../'])
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        setTimeout(()=>{
          this.dtTrigger.next();
        },1000)
    });
  }

  approve(usn){
    this.stuServe.approve(usn).subscribe((result:res)=>{
      if(result.statusCode==200){
        alert("Student Account Approved");
        this.router.navigate(['../account-requests']);
      }
    }, err=>{
      alert("Student Approval failed");
    });
  }
  
  reject(usn){
    this.stuServe.reject(usn).subscribe((result:res)=>{
      if(result.statusCode==200){
        alert("Student Account Rejected Successfully");
        this.router.navigate(['../account-requests']);
      }
    }, err=>{
      alert("Student Rejection failed");
    });
  }

}
