import { project } from './../models/project.model';
import { Router } from '@angular/router';
import { SharedUrlService } from './../../services/shared-url.service';
import {  FormControl,  FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { res } from '../models/res.model';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive'
import { Subject } from 'rxjs';
import * as FileSaver from 'file-saver'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-print-projects',
  templateUrl: './print-projects.component.html',
  styleUrls: ['./print-projects.component.css']
})
export class PrintProjectsComponent implements OnInit,AfterViewInit {

  projects:any;
  depCode: any;
  depName: any;
  showTypes: any;
  typesArray: any;
  advSub: boolean;
  fail:boolean;
  success:boolean
  found: boolean;
  notfound: boolean;
  sortedArr: project[] = [];


  requiredProjects: any = [];
  dtOptions: any = {};

  @ViewChild (DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  deleteSuccess: boolean;
  deleteFail: boolean;
  notuploaded: boolean;

  constructor(
    private proService: ProjectsService,
    private userService: UserService,
    private sUrl: SharedUrlService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.sUrl.setPreviousUrl(this.router.routerState.snapshot.url)
    this.userService.getDetails().subscribe((result:res)=>{
      this.userService.setUser(result.body);
      this.depCode = this.userService.userDetail.DEP_CODE;
      this.depName = this.userService.userDetail.DEPARTMENT;
      this.searchForm.get('DEPARTMENT').setValue(this.depCode);
      this.proService.fetchAllProjects(result.body).subscribe((resul:res)=>{
        this.projects = resul.body;
        console.log(resul,"proo3o");
        this.requiredProjects = this.projects;
        this.dtOptions = {
          pagingType: 'full_numbers',
          processing: true,
          dom: 'frtip',
        };
        this.dtTrigger.next();

      })
      this.proService.getProjectTypes().subscribe((result:res) => {
        this.typesArray = result.body
        console.log(this.typesArray,"uuu");
      })
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../'])
        }
      }
    })
  }

  searchForm = new FormGroup({
    YEAR: new FormControl('', [Validators.required]),
    DEPARTMENT: new FormControl('',[Validators.required]),
    LEVEL: new FormControl('',[Validators.required]),
    SEMESTER: new FormControl('',[Validators.required, Validators.min(1), Validators.max(8)]),
    PRO_TYPE: new FormControl('',[Validators.required])
  })

  get year(){ return this.searchForm.get('YEAR') }
  get department(){ return this.searchForm.get('DEPARTMENT') }
  get level(){ return this.searchForm.get('LEVEL') }
  get sem(){ return this.searchForm.get('SEMESTER') }
  get type(){ return this.searchForm.get('PRO_TYPE') }

  getTypes(level){
    this.showTypes = this.typesArray.filter(function(type){
      return type.LEVEL == level
    });

    this.showTypes.forEach((e)=>{
      console.log(e.TYPE_CODE);
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
 }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        setTimeout(()=>{
          this.dtTrigger.next();
        })
    });
  }

  returnBlob(res){
    return new Blob([res], {type: 'application/pdf'})
  }

  returnPPTBlob(res){
    return new Blob([res], {type: 'application/vnd.ms-powerpoint' })
  }

  viewSynopsis(index){

    if(this.requiredProjects[index].SYNOPSIS!="" && this.requiredProjects[index].SYNOPSIS!=null && this.requiredProjects[index].SYNOPSIS!=undefined){
      this.proService.viewPdf(this.requiredProjects[index].SYNOPSIS).subscribe(res=>{
        const url = window.URL.createObjectURL(this.returnBlob(res));
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
    if(this.requiredProjects[index].REPORT!="" && this.requiredProjects[index].REPORT!=null && this.requiredProjects[index].REPORT!=undefined){
      this.proService.viewPdf(this.requiredProjects[index].REPORT).subscribe(res=>{
        const url = window.URL.createObjectURL(this.returnBlob(res));
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
    if(this.requiredProjects[index].PPT!="" && this.requiredProjects[index].PPT!=null && this.requiredProjects[index].PPT!=undefined){
      var ext = this.requiredProjects[index].PPT.split('.').pop();
      this.proService.viewPdf(this.requiredProjects[index].PPT).subscribe(res=>{
        console.log(res)
        var url;
        if(ext=='pptx'|| ext == 'ppt'){
           url = window.URL.createObjectURL(this.returnPPTBlob(res));
        }else if(ext=='pdf'){
           url = window.URL.createObjectURL(this.returnBlob(res));
        }
        console.log(url);
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
      this.onSubmit()
      this.deleteSuccess = true;
      this.deleteFail = false;
      window.scroll(0,0);
      setTimeout(()=>{
        this.deleteSuccess = false;
      }, 5000);
      this.dtTrigger.unsubscribe();
      this.dtTrigger.next();

    }, err => {
      this.deleteFail = true;
      setTimeout(()=>{
        this.deleteFail = false;
      },5000);
      this.deleteSuccess = false;
      window.scroll(0,0);
    })
  }

  returnxlsxBlob(result){
    return new Blob([result],{type:'application/x-msexcel'})
  }

  onSubmit(){
    this.requiredProjects = [];
    var year = this.year.value;
    var dep = this.department.value;
    var level = this.level.value;
    var sem = this.sem.value;
    var type = this.typesArray.filter((e)=>{
      return e.TYPE_CODE == this.type.value && e.LEVEL == this.level.value;
    });
    this.requiredProjects = this.projects.allProjects.filter(function(project){
      return project.YEAR == year && project.DEPARTMENT == dep && project.LEVEL == level && project.SEMESTER == sem && project.PRO_TYPE == type[0].TYPE_NAME
    })

    this.requiredProjects.sort((a,b)=>a.BATCH.localeCompare(b.BATCH));
    if(this.requiredProjects.length){
      setTimeout(()=>{
        this.dtTrigger.unsubscribe();
        this.dtTrigger.next();
      })
      this.found = true;
      this.notfound=false;
    }
    else{
      this.found=false;
      this.notfound=true;
    }

  }

  sortArr(){
    this.onSubmit();
    this.sortedArr.splice(0,this.sortedArr.length);
    this.requiredProjects.forEach(element => {
      this.sortedArr.push(element);
    });
  }

  printFile(){
    this.sortArr()
    this.proService.printProjects(this.sortedArr).subscribe((res)=>{
      FileSaver.saveAs(this.returnxlsxBlob(res), 'projects.xlsx');
        this.proService.fetchAllProjects(this.userService.userDetail).subscribe((res:res)=>{
          this.projects = res.body;
        })
    }, err => {
      this.fail=true;
      setTimeout(()=>{
        this.fail = false;
      }, 5000)
    })
  }

}


