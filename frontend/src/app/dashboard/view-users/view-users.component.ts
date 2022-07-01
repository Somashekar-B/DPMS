import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { res } from './../models/res.model';
import { UserService } from './../../services/user.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit{

  allUsers: any;
  deleteData: any = {};
  success: boolean;
  fail: boolean;
  mailSent: boolean = true;
  newAccess: string;
  msg: string;
  accessData: any = {};
  accessChangesuccess: boolean;
  accessChangeFailure: boolean;
  mySubscription: any;

  constructor(
    private userServe: UserService, 
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

  @ViewChild (DataTableDirective)
  dtElement : DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions: any = {};
  ngOnInit() {
    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      this.userServe.getAllUsers(this.userServe.userDetail.DEP_CODE).subscribe((result: res) => {
        this.allUsers = result.body;
        console.log(this.allUsers);
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

  deleteUser(uname){
    var user = this.allUsers.filter(user => {
      if(user.USERNAME == uname){
        return user.EMAIL;
      }
    });
    this.deleteData.delEmail = user[0].EMAIL;
    this.deleteData.delUname = uname;
    this.deleteData.name = this.userServe.userDetail.NAME;
    this.deleteData.email = this.userServe.userDetail.EMAIL;

    this.userServe.deleteUser(this.deleteData).subscribe((result:res)=>{
      if(result.statusCode==200){
        this.success = true;
        this.fail = false;
        this.mailSent = true;
        setTimeout(() => {
          this.success = false;
        }, 5000);
        window.scroll(0,0);
        this.rerender();
      }
      else if(result.statusCode==401){
        this.success = false;
        this.fail = false;
        this.mailSent = false;
        setTimeout(() => {
          this.mailSent = true;
        }, 5000);
        window.scroll(0,0);
      }
    }, err => {
      this.success = false;
      this.fail = true;
      this.mailSent = true;
      setTimeout(() => {
        this.fail = false;
      }, 5000);
      
      window.scroll(0,0);

    })
    this.rerender();
  }

  changeAccess(index){
    if(this.allUsers[index].USERTYPE=="Faculty"){
      this.newAccess = "Admin";
      this.msg = "This will provide them more access to the portal";
    }else{
      this.newAccess = "Faculty";
      this.msg = "This can constrain their access to portal with minimum options";
    }
    if(confirm(`Do you wish to change ${this.allUsers[index].NAME}'s access from ${this.allUsers[index].USERTYPE} to ${this.newAccess}\n\n ${this.msg}`)){
      // console.log("changed");
      this.accessData.name = this.allUsers[index].NAME;
      this.accessData.email = this.allUsers[index].EMAIL;
      this.accessData.oldAccess = this.allUsers[index].USERTYPE;
      this.accessData.newAccess = this.newAccess
      this.accessData.admin = this.userServe.userDetail.NAME

      this.userServe.changeAccess(this.accessData).subscribe((result:res)=>{
        this.accessChangesuccess = true;
        this.accessChangeFailure = false;
        setTimeout(()=>{
          this.accessChangesuccess = false;
        },4000) 
        alert('Acess Changed Successlly..!');
        this.router.navigate(['../view-all-users']);
      }, err=>{
        this.accessChangeFailure = true;
        this.accessChangesuccess = false;
      })
    // console.log(this.accessData);
      this.rerender();      
    }
  }
}
