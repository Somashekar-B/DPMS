import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { proType } from './../models/types.model';
import { res } from './../models/res.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ProjectsService } from 'src/app/services/projects.service';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-view-project-types',
  templateUrl: './view-project-types.component.html',
  styleUrls: ['./view-project-types.component.css']
})
export class ViewProjectTypesComponent implements OnInit {
  projectsTypes: proType[]= [];
  dtOptions: any = {};

  @ViewChild (DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  success: boolean;
  fail: boolean;
  user: any;
  constructor(
    private proService: ProjectsService,
    private http: HttpClient,
    private userServe: UserService,
    private router: Router,
    private sUrl: SharedUrlService){ }

  ngOnInit(): void{
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6,
      processing: true,
      destroy:true,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', className: 'btn btn-dark mx-2 glyphicon glyphicon-duplicate' },
        { extend: 'excel', className: 'btn btn-primary mx-2 glyphicon glyphicon-list-alt' },
        { extend: 'print', className: 'btn btn-success mx-2 glyphicon glyphicon-print' }
      ]
    };

    this.proService.getProjectTypes().subscribe((res: res) => {
      this.projectsTypes=res.body;
      this.dtTrigger.next()
    });

    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      this.user = result.body;
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
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        setTimeout(()=>{
          this.dtTrigger.next();
        })
    });
  }

  deleteProjectTypes(data){
    this.proService.deleteProjectType(data).subscribe((resu: res) => {
      this.projectsTypes = resu.body;
      this.success = true;
      this.fail = false;
      window.scroll(0,0);
      setTimeout(()=>{
        this.success = false;
      }, 5000);
      this.rerender();
    }, err => {
      this.fail = true;
      setTimeout(()=>{
        this.fail = false;
      }, 5000);
      this.success = false;
      window.scroll(0,0);
    })
  }

  updateProjectType(index){
    this.sUrl.level= this.projectsTypes[index].LEVEL;
    this.sUrl.typecode = this.projectsTypes[index].TYPE_CODE;
    this.router.navigate(['../update-project-type']);
  }

}


