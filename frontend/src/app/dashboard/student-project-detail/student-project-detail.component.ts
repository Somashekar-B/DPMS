import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { UserService } from 'src/app/services/user.service';
import { res } from '../models/res.model';

@Component({
  selector: 'app-student-project-detail',
  templateUrl: './student-project-detail.component.html',
  styleUrls: ['./student-project-detail.component.css']
})
export class StudentProjectDetailComponent implements OnInit {

  proId: string;
  project: any;
  notfound: boolean;
  notuploaded: boolean;
  reportUrl: string;
  pptUrl: any;
  constructor(private proService: ProjectsService, private activatedRoute: ActivatedRoute, private router: Router, private userServe:UserService) {
    this.activatedRoute.paramMap.subscribe(params=>{
      this.proId = params.get('proId');
      this.getProject(this.proId);
    })
   }

  ngOnInit(): void {
  }

  getProject(proId){
    this.proService.getProject(proId).subscribe((result:res)=>{
      this.project = result.body[0];
      console.log(this.project);
    }, err=>{
      alert('Invalid Project ID');
      this.router.navigate(['../../projects-blog']);
    })
  }

  isDocuments(){
    return (this.project.SYNOPSIS==null || this.project.SYNOPSIS=='') && (this.project.REPORT==null || this.project.REPORT=='') && (this.project.PPT==null || this.project.PPT=='')
  }

  
  returnBlob(res){
    return new Blob([res], {type: 'application/pdf' })
  }

  returnPPTBlob(res){
    return new Blob([res], {type: 'application/vnd.ms-powerpoint' })
  }

  viewSynopsis(){
    if(this.project.SYNOPSIS!="" && this.project.SYNOPSIS!=null && this.project.SYNOPSIS!=undefined){
      this.proService.viewPdf(this.project.SYNOPSIS).subscribe(res=>{
        console.log(res,"bodyyy");
         const url = window.URL.createObjectURL(this.returnBlob(res));
        // this.synopsisUrl = url;
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

  viewReport(){
    if(this.project.REPORT!="" && this.project.REPORT!=null && this.project.REPORT!=undefined){
      this.proService.viewPdf(this.project.REPORT).subscribe(res=>{
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

  viewPpt(){
    if(this.project.PPT!="" && this.project.PPT!=null && this.project.PPT!=undefined){
      var ext = this.project.PPT.split('.').pop();
      this.proService.viewPdf(this.project.PPT).subscribe(res=>{
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

  logout(){
    this.userServe.logout();
    this.router.navigate([''])
  }

}
