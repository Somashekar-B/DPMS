import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { res } from '../models/res.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-add-project-type',
  templateUrl: './add-project-type.component.html',
  styleUrls: ['./add-project-type.component.css']
})
export class AddProjectTypeComponent implements OnInit {

  advSub: boolean;
  success: boolean;
  fail: boolean;
  typecode: String;
  typelevel: String;
  typeDetails: any;
  invalid: boolean;

  constructor( 
    private proService: ProjectsService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private userServe: UserService,
    private sUrl: SharedUrlService
    ) {
    // route.paramMap.subscribe(para =>{
    //   if(para.get('typecode')!=null && para.get('level')!=null){
    //     this.typecode=para.get('typecode');
    //     this.typelevel=para.get('level');
    //     proService.fetchProjectType(this.typelevel, this.typecode).subscribe((result:res)=>{
    //       this.typeDetails=result.body;
    //       if(this.typeDetails!=undefined){
    //         this.typeForm.setValue(this.typeDetails);
    //       }
    //       else{
    //         this.invalid=true;
    //         this.typeForm.disable();
    //       }
    //     })
    //   }
    //   else{
    //     this.typeForm.get('DEPARTMENT').setValue("CS");
    //   }
    //   this.advSub = false;
    //   this.success= false;
    // });

    if(this.sUrl.typecode!=undefined && this.sUrl.level!=undefined){
      this.typecode=this.sUrl.typecode;
        this.typelevel= this.sUrl.level;
        proService.fetchProjectType(this.typelevel, this.typecode).subscribe((result:res)=>{
          this.typeDetails=result.body;
          if(this.typeDetails!=undefined){
            this.typeForm.setValue(this.typeDetails);
          }
          else{
            this.invalid=true;
            this.typeForm.disable();
          }
        })
    }else{
      this.typeForm.get('DEPARTMENT').setValue("CS");
    }
    this.advSub = false;
    this.success= false;

    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body)
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['../']);
        }
      }
    });

  }

  ngOnInit(): void {
  }

  typeForm = new FormGroup({
    TYPE_NAME:new FormControl('', [Validators.required]),
    TYPE_CODE: new FormControl('', [Validators.required]),
    SEMESTER: new FormControl('', [Validators.min(1), Validators.max(8)]),
    DEPARTMENT: new FormControl('', [Validators.required]),
    LEVEL: new FormControl('', [Validators.required]),
    AVAIL_BATCHES: new FormControl(''),
  });

  get tname(){return this.typeForm.get('TYPE_NAME')};
  get tcode(){return this.typeForm.get('TYPE_CODE')};
  get sem(){return this.typeForm.get('SEMESTER')};
  get dep(){return this.typeForm.get('DEPARTMENT')};
  get level(){return this.typeForm.get('LEVEL')};
  get availBatches(){return this.typeForm.get('AVAIL_BATCHES')};

  returnBack(){
    this.sUrl.level=undefined;
    this.sUrl.typecode=undefined;
    this.router.navigate(['/view-project-types']);
  }

  onSubmit(){
    if(this.typecode!=undefined && this.typelevel!=undefined){
      if(!this.invalid){
        this.typeDetails=this.typeForm.value;
        this.typeDetails.OLD_TYPE_CODE = this.typecode;
        this.typeDetails.OLD_LEVEL = this.typelevel;
        this.proService.updateProjectType(this.typeDetails).subscribe((result: res)=>{
          if(result.statusCode == 200){
            this.success = true;
            this.fail = false;
            this.sUrl.level=undefined;
            this.sUrl.typecode=undefined;
            setTimeout(() => {
              this.success = !this.success;
            }, 5000);
          }
        }, err => {
          this.success = false;
          this.fail = true;
          setTimeout(()=>{
            this.fail = false;
          },5000)
        })
      }
    }
    else{
      this.proService.addProTypes(this.typeForm.value).subscribe((result:res)=>{
        if(result.statusCode == 200){
          this.success = true;
          this.fail = false;
          this.typeForm.reset();
          setTimeout(() => {
            this.success = !this.success;
          }, 5000);
        }
      }, err=>{
        this.fail = true
        setTimeout(()=>{
          this.fail = false;
        },5000)
        this.success = false;
        this.typeForm.reset();
      })
    }
      window.scroll(0,0);

    }
}
