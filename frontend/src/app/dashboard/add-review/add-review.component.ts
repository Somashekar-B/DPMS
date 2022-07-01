import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { UserService } from 'src/app/services/user.service';
import { ProjectsService } from 'src/app/services/projects.service'
import { res } from '../models/res.model';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit {

  proId: String;
  projectID: any;
  found: boolean;
  msg: boolean;
  falseID: boolean;
  project: any;
  proTitle: String;
  guide: String;
  students: any;
  reviews: any;
  isReviewsAdded: boolean;
  reviewForm: any;
  newReview: any = {};
  success: boolean;
  fail: boolean;
  message: any;
  update: boolean = false;
  buttonName: String = "Add Review";
  cancel: boolean;
  oldLabel: any;
  updateSuccess: boolean; 
  failWord: string = "Add";
  deleteData: any = {}
  delete: boolean;
  successWord: string;
  unauthorized: boolean;
  user: any;
  constructor(
    private userServe: UserService, 
    private router: Router, 
    private proService: ProjectsService,
    private sUrl: SharedUrlService,
    private route: ActivatedRoute, 
    ) { 
    
    this.projectID = new FormGroup({
      proID: new FormControl('', [Validators.maxLength(12), Validators.required])
   });
   
    this.reviewForm = new FormGroup({
      label: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
    
  }

  ngOnInit(): void {
    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      this.user = result.body;
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status===401){
          this.router.navigate(['login']);
        }
      }
    });

    if(this.sUrl.proId!=undefined){
      this.pro.setValue(this.sUrl.proId);
    }
  }

  ngOnDestroy(): void{
    this.sUrl.proId = undefined;
  }

  get pro(){return this.projectID.get('proID')}

  get label(){return this.reviewForm.get('label')}
  get description(){ return this.reviewForm.get('description')}
  
  getvalue(){
    this.proService.getProject(this.projectID.get('proID').value).subscribe((result:res)=>{
      console.log(result.body);
      if(result.statusCode==200){
        if(this.user.USERTYPE==='Admin' || result.body[0].GUIDE===this.user.NAME){
          this.found=true;
          this.falseID = false;
          this.project = result.body;
          this.setDefaultValues();
        }
        else{
          this.unauthorized = true;
          this.found=false;
          setTimeout(() => {
            this.unauthorized = false;
          }, 4000);
        }
      }

      
    }, err=>{
      this.found=false;
      this.falseID = true;
      setTimeout(()=>{
        this.falseID = false;
      },3000)
    });
  }

  setDefaultValues(){
    this.proTitle = this.project[0].PRO_TITLE;
    this.proId = this.project[0].PRO_ID;
    this.guide = this.project[0].GUIDE;
    this.students = this.project[0].students;
    this.reviews = this.project[0].reviews;
    if(this.reviews.length!=0){
      this.isReviewsAdded = true;
    }
    // console.log(this.project.PRO_TITLE+"-"+this.proId+"-"+this.guide+"-"+this.students[0]);
  }

  reviewSubmit(){
    this.newReview.proID = this.proId;
    this.newReview.oldLabel = this.oldLabel;
    this.newReview.label = this.label.value;
    this.newReview.description = this.description.value;
    // console.log(this.newReview);
    if(this.update===false){
      this.proService.addReview(this.newReview).subscribe((result:res)=>{
        if(result.statusCode==200){
          this.success = true;
          this.fail = false;
          this.successWord = "Added";
          this.reviews = [];
          result.body[0].forEach(element => {
            this.reviews.push(element)
          });
          setTimeout(()=>{
            this.success = false;
          },5000);
        }
        this.reviewForm.get('label').setValue('');
        this.reviewForm.get('description').setValue('');
      }, err=>{
        this.failWord = "Add";
        this.fail=true;
        this.success = false;
        
      });
    }else{
      this.proService.updateReview(this.newReview).subscribe((result:res)=>{
        if(result.statusCode==200){
          this.success = true
          this.successWord = "Updated"
          this.fail = false;
          this.reviews = [];
          result.body[0].forEach(element => {
            this.reviews.push(element)
          });
          setTimeout(()=>{
            this.success = false;
          },5000);
        }
        this.cancelUpdate();
      }, err=>{
        this.failWord = "Update";
        this.success = false;
        this.fail = true;
        
      });
    }
    // window.scroll(0,0);
  }

  autofillForm(label,description){
    this.oldLabel = label;
    this.reviewForm.get('label').setValue(label);
    this.reviewForm.get('description').setValue(description);
    window.scroll(0,window.innerHeight+100)
    this.buttonName = "Update Review"
    this.update=true;
    this.failWord = "Update"
  }

  cancelUpdate(){
    this.success=false;
    this.update=false;
    this.buttonName = "Add Review";
    this.reviewForm.get('label').setValue('');
    this.reviewForm.get('description').setValue('');
  }

  deleteReview(label){
    if(confirm('Are you sure to delete Review')){
      this.deleteData.proID = this.proId;
      this.deleteData.label = label;
  
      this.proService.deleteReview(this.deleteData).subscribe((result:res)=>{
        this.success = true;
        this.fail = false;
        setTimeout(()=>{
          this.delete = false;
        });
        // console.log(result.body);
        this.reviews = [];
        result.body[0].forEach(element => {
          this.reviews.push(element);
        });
  
        this.successWord = "Deleted";
      }, err=>{
        this.success = false;
        this.failWord = "Delete";
        this.fail = true;
      });

      // window.scroll(0,0);
    }
  }


}
