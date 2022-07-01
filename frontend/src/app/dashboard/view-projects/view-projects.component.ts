import { SharedUrlService } from './../../services/shared-url.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectsService } from './../../services/projects.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {project} from '../models/project.model';
import { Subject } from 'rxjs'
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import {res} from '../models/res.model';


@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css']
})
export class ViewProjectsComponent implements OnInit {

  projects: project[]= [];
  dtOptions: any = {};

  @ViewChild (DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  success: boolean;
  fail: boolean;
  notfound: boolean;
  notuploaded: boolean;
  user: any;
  synopsisUrl: any;
  reportUrl: any;
  pptUrl: any;
  allProjects: any;
  onlyProjects: any;
  allShown: boolean;

  constructor(
    private proService: ProjectsService,
    private userServe: UserService,
    private sUrl: SharedUrlService,
    private router: Router){ }

  ngOnInit(): void{

    this.sUrl.setPreviousUrl(this.router.routerState.snapshot.url)
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'frtip',
    };

      this.userServe.getDetails().subscribe((result:res)=>{
        this.userServe.setUser(result.body);
        this.user = result.body;
        this.proService.fetchAllProjects(result.body).subscribe((res: res) => {
          this.allProjects = res.body.allProjects;
          this.onlyProjects = res.body.only;
          this.projects=res.body.allProjects;
          this.allShown = true;
          this.dtTrigger.next()
        });
      }, err=>{
        if(err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['../'])
          }
        }
      })
    }

    only(){
      this.projects = this.onlyProjects;
      this.allShown = false;
    }
    all(){
      this.projects = this.allProjects;
      this.allShown = true;
    }

    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }

    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          setTimeout(()=>{
            this.dtTrigger.next();
          },1000)
      });
  }

  returnBlob(res){
    return new Blob([res], {type: 'application/pdf' })
  }

  returnPPTBlob(res){
    return new Blob([res], {type: 'application/vnd.ms-powerpoint' })
  }

  viewSynopsis(index){

    if(this.projects[index].SYNOPSIS!="" && this.projects[index].SYNOPSIS!=null && this.projects[index].SYNOPSIS!=undefined){
      this.proService.viewPdf(this.projects[index].SYNOPSIS).subscribe(res=>{
        const url = window.URL.createObjectURL(this.returnBlob(res));
        this.synopsisUrl = url;
        window.open(url)
      }, err=>{
        this.notfound = true;
        setTimeout(()=>{
          this.notfound=false;
        },5000)
        window.scroll(0,0);
      })
    }else{
      this.notuploaded = true;
      setTimeout(()=>{
        this.notuploaded=false;
      },5000)
    }
  }

  viewReport(index){
    if(this.projects[index].REPORT!="" && this.projects[index].REPORT!=null && this.projects[index].REPORT!=undefined){
      this.proService.viewPdf(this.projects[index].REPORT).subscribe(res=>{
        const url = window.URL.createObjectURL(this.returnBlob(res));
        this.reportUrl = url;
        window.open(url)
        
      }, err=>{
        this.notfound = true;
        setTimeout(()=>{
          this.notfound=false;
        }, 5000)
      })
    }
    else{

      this.notuploaded = true;
      setTimeout(()=>{
        this.notuploaded=false;
      },5000)
    }
  }

  viewPpt(index){
    if(this.projects[index].PPT!="" && this.projects[index].PPT!=null && this.projects[index].PPT!=undefined){
      var ext = this.projects[index].PPT.split('.').pop();
      this.proService.viewPdf(this.projects[index].PPT).subscribe(res=>{
        var url;
        if(ext=='pptx'|| ext == 'ppt'){
           url = window.URL.createObjectURL(this.returnPPTBlob(res));
        }else if(ext=='pdf'){
           url = window.URL.createObjectURL(this.returnBlob(res));
        }
        this.pptUrl = url;
        window.open(url)
      }, err=>{
        this.notfound = true;
        setTimeout(()=>{
          this.notfound=false;
        },5000)
      })
    }
    else{
      this.notuploaded = true;
      setTimeout(()=>{
        this.notuploaded=false;
      },5000)
    }
  }

  deleteProject(proId){
    this.proService.deleteProject(proId).subscribe((resu: res) => {
      this.projects = resu.body;
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

}
