import { SharedUrlService } from './../../services/shared-url.service';
import { student } from './../models/student.model';
import { res } from './../models/res.model';
import { ProjectsService } from 'src/app/services/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { StudentsService } from 'src/app/services/students.service';
import { UserService } from 'src/app/services/user.service';
import { project } from '../models/project.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-project-detail-view',
  templateUrl: './project-detail-view.component.html',
  styleUrls: ['./project-detail-view.component.css']
})
export class ProjectDetailViewComponent implements OnInit {
  proId: any;
  project: any;
  fail: boolean;
  showTypes: any;
  typesArray: any;
  tempTypes: any;
  projectForm: any;
  localStudentsarray: any;
  allTechs: any;
  allPros: any;
  projectCopy: any;
  exist: boolean;
  newStudents: student[]=[];
  different: any;
  stuUSNs: String[]=[];
  oldStudents: student[]=[];
  distinct:student[];
  success: boolean;
  duplicate: boolean;
  advSub: boolean;
  stuInvalid: boolean;
  basicInavlid: boolean;
  techInvalid: boolean;
  docsInvalid: boolean;
  newSynopsis: string;
  newReport: string;
  newPpt: string;
  SynopsisName: String;
  ReportName:String;
  PptName: String;
  previousUrl: string;
  notfound: boolean;
  disableSynopsis: boolean;
  disableReport: boolean;
  disablePpt: boolean;
  fetchfail: boolean;
  reviews: any;
  allUsers: any;
  user: any;


  constructor(
    private router: Router,
    private proService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private stuService: StudentsService,
    private formBuilder: FormBuilder,
    private userServe: UserService,
    private sUrl: SharedUrlService
    ) {
    this.activatedRoute.paramMap.subscribe(params =>{
      this.proId = params.get('proId');
    });
    }

    ngOnInit(): void {

      this.sUrl.previousUrl$.subscribe(arg => {
        this.previousUrl = '..' + arg;
     })

      this.userServe.getDetails().subscribe((result:res)=>{
        this.userServe.setUser(result.body);
        this.user = result.body;
        this.setGuide();
        this.userServe.getAllUsers(this.userServe.userDetail.DEP_CODE).subscribe((result:res)=>{
        this.allUsers = result.body;
      })
        this.initialize();
      }, err=>{
        if(err instanceof HttpErrorResponse){
          if(err.status===401){
            this.router.navigate(['../'])
          }
        }
      })

    }

    setGuide(){
      this.basicForm.get('GUIDE').setValue(this.user.NAME);
    }

    initialize(){
      this.proService.getAllTechs().subscribe((result: res) => {
        this.allTechs = result.body
      })

       var year =  new Date().getFullYear();
       this.basicForm.get('YEAR').setValue(year)

      this.stuService.getAllStudents().subscribe((result: res)=> {
        this.localStudentsarray = result.body
      })

      this.proService.fetchAllProjects(this.userServe.userDetail).subscribe((result: res) => {
        this.allPros = result.body.allProjects
      })

      this.proService.getProject(this.proId).subscribe((result: res)=>{
        if(result.statusCode == 200){
          this.project = result.body;
          this.projectCopy = result.body;
          this.reviews = this.project[0].reviews

          this.oldStudents = this.project[0].students;
          this.projectCopy = result.body;
          this.docsFormSetValue();
          var temp;
          if(this.projectCopy[0].SYNOPSIS){
            this.SynopsisName = this.projectCopy[0].SYNOPSIS.split('\\').pop()
            // this.SynopsisName = temp[temp.length-1];
          }
          if(this.projectCopy[0].REPORT){
            this.ReportName = this.projectCopy[0].REPORT.split('\\').pop()
            // this.ReportName = temp[temp.length-1];
          }
          if(this.projectCopy[0].PPT){
            this.PptName = this.projectCopy[0].PPT.split('\\').pop()
            // this.PptName = temp[temp.length-1];
          }



          this.proService.getProjectTypes().subscribe((result:res) => {
            this.typesArray = result.body;

            this.basicFormSetValue();
            this.docsFormSetValue();
            this.techFormSetValue();
            this.studentsFormSetValue();

            this.project[0].SYNOPSIS = null;
            this.project[0].REPORT = null;
            this.project[0].PPT = null;
          })
        }
      }, err =>{
        this.fetchfail = true;
        setTimeout(()=>{
          this.fetchfail = false
        }, 5000);
      });


    }

    basicForm = this.formBuilder.group({
      YEAR: ['', [Validators.required, Validators.minLength(4)]],
      PRO_TITLE: ['', [Validators.required, Validators.pattern('[a-zA-Z- ]*')]],
      DEPARTMENT: ['', Validators.required],
      LEVEL: ['', [Validators.required]],
      PRO_TYPE: ['', [Validators.required]],
      SEMESTER: ['', [Validators.required, Validators.min(1), Validators.max(8), Validators.maxLength(1)]],
      BATCH: ['', [Validators.required,Validators.pattern('[a-zA-Z][0-9]*'), Validators.maxLength(3), Validators.minLength(2)]],
      GUIDE: ['', [Validators.required, Validators.pattern('[a-zA-Z. ]*')]]
    });

    documentsForm = this.formBuilder.group({
      SYNOPSIS: [''],
      DIS_SYNOPSIS: [''],
      REPORT: [''],
      DIS_REPORT: [''],
      PPT: [''],
      DIS_PPT: ['']
    })

    technologyForm = this.formBuilder.group({
      technology: this.formBuilder.array([])
    })

    studentForm = this.formBuilder.group({
      stus: this.formBuilder.array([])
    })

    get proTitle(){return this.basicForm.get('PRO_TITLE')};
    get year(){return this.basicForm.get('YEAR')};
    get department(){return this.basicForm.get('DEPARTMENT')};
    get level(){return this.basicForm.get('LEVEL')};
    get type(){return this.basicForm.get('PRO_TYPE')};
    get semester(){return this.basicForm.get('SEMESTER')};
    get batch(){return this.basicForm.get('BATCH')};
    get guide(){return this.basicForm.get('GUIDE')};

    get synopsis(){return this.documentsForm.get('SYNOPSIS')};
    get dis_synopsis(){return this.documentsForm.get('DIS_SYNOPSIS')};
    get report(){return this.documentsForm.get('REPORT')};
    get dis_report(){return this.documentsForm.get('DIS_REPORT')};
    get ppt(){return this.documentsForm.get('PPT')};
    get dis_ppt(){return this.documentsForm.get('DIS_PPT')};

    get technologies(){return this.technologyForm.get('technology') as FormArray};

    get studs(){return this.studentForm.get('stus') as FormArray}


    updateReview(){
      this.sUrl.proId = this.proId;
      this.router.navigate(['../update-review'])
    }

    getTypes(level){
      this.showTypes = this.typesArray.filter(function(type){
        return type.LEVEL == level
      })
    }

    // setGuide(){
    //   this.projectForm.get('guide').setValue(this.user.NAME);
    // }

    batchRequire(type,level){
      this.tempTypes = this.typesArray.filter(function(indiType){
        return ((indiType.TYPE_CODE == type) && (indiType.LEVEL == level))
      })
      if(!this.tempTypes[0].AVAIL_BATCHES){
        this.basicForm.get('BATCH').disable()
      }
      else{
        this.basicForm.get('BATCH').enable()
      }
    }

    addTech(){
      var technology = this.formBuilder.group({
        TECHNOLOGY: ['',[Validators.required]]
      })
      this.technologies.push(technology)
    }

    removeTech(index){
      this.technologies.removeAt(index)
    }

    addStudent(){
      var newStudent = this.formBuilder.group({
        OLDUSN: ['', [Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
        USN: ['', [Validators.required, Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
        NAME: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        MOBILE_NO: [''],
        EMAIL: ['', [Validators.email]],
        ACADEMIC_BATCH: ['',[Validators.maxLength(7)]]
      })
      this.studs.push(newStudent);
    }

    removeForm(index){
      this.studs.removeAt(index);
    }

    returnBack(){
      this.router.navigate([this.previousUrl]);
    }

    basicFormSetValue(){
      this.basicForm.get('PRO_TITLE').setValue(this.project[0].PRO_TITLE);
      this.basicForm.get('YEAR').setValue(this.project[0].YEAR);
      this.basicForm.get('DEPARTMENT').setValue(this.project[0].DEPARTMENT);
      this.basicForm.get('LEVEL').setValue(this.project[0].LEVEL);
      this.basicForm.get('GUIDE').setValue(this.project[0].GUIDE);
      this.getTypes(this.basicForm.get('LEVEL').value);
      this.basicForm.get('PRO_TYPE').setValue(this.project[0].PRO_TYPE);
      this.basicForm.get('SEMESTER').setValue(this.project[0].SEMESTER);
      this.basicForm.get('BATCH').setValue(this.project[0].BATCH);

      this.batchRequire(this.basicForm.get('PRO_TYPE').value,this.basicForm.get('LEVEL').value);

    }

    docsFormSetValue(){
      this.documentsForm.get('SYNOPSIS').setValue(this.project[0].SYNOPSIS)
      this.documentsForm.get('REPORT').setValue(this.project[0].REPORT)
      this.documentsForm.get('PPT').setValue(this.project[0].PPT)
      if(this.SynopsisName=="" || this.SynopsisName==null || this.SynopsisName==undefined){
        this.disableSynopsis = true
      }
      else{
        this.disableSynopsis=false
      }
      if(this.ReportName=="" || this.ReportName==null || this.ReportName==undefined){
        this.disableReport = true
      }
      else{
        this.disableReport=false
      }

      if(this.PptName=="" || this.PptName==null || this.PptName==undefined){
        this.disablePpt = true
      }
      else{
        this.disablePpt=false
      }
    }

    techFormSetValue(){
      this.technologies.clear();
      for(var i=0; i<this.project[0].technologies.length; i++){
        var technology = this.formBuilder.group({
          TECHNOLOGY: ['',[Validators.required]]
        })
        technology.get('TECHNOLOGY').setValue(this.project[0].technologies[i].TECHNOLOGY);
        this.technologies.push(technology);
      }
    }

    studentsFormSetValue(){
      this.stuUSNs = [];
      this.studs.clear();
      this.project[0].students.forEach(element => {
        var stu = this.formBuilder.group({
          OLDUSN: ['', [Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
          USN: ['', [Validators.required, Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
          NAME: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          MOBILE_NO: [''],
          EMAIL: ['', [Validators.email]],
          ACADEMIC_BATCH: ['', [Validators.maxLength(7)]]
        });

        stu.get('USN').setValue(element.USN);
        stu.get('NAME').setValue(element.NAME);
        stu.get('MOBILE_NO').setValue(element.MOBILE_NO);
        stu.get('EMAIL').setValue(element.EMAIL);
        stu.get('ACADEMIC_BATCH').setValue(element.ACADEMIC_BATCH);

        this.studs.push(stu);
      });

      for(var i=0; i<this.studs.length; i++){
        this.studs.at(i).get('OLDUSN').setValue(this.studs.value[i].USN);
        this.stuUSNs.push(this.studs.value[i].USN);
        if(this.studs.value[i].USN.length==10){
          this.studs.at(i).get('USN').disable();
        }
      }
      this.project[0].stuUSNs = this.stuUSNs;

    }

    saveStudents(){
      if(this.studentForm.valid){
        this.stuUSNs = [];
        for(var i=0; i<this.studs.length; i++){
          this.studs.at(i).get('USN').enable();
        }

        this.duplicate = false;
        for(var i=0; i<this.studs.length-1; i++){
          for(var j=i+1; j<this.studs.length; j++){
            if(this.studs.value[i].USN==this.studs.value[j].USN){
              this.duplicate = true;
              return;
            }
          }
        }

        this.studs.value.forEach(element => {
          if(element.OLDUSN==''){
            element.OLDUSN = element.USN;
          }
          this.stuUSNs.push(element.USN);
        });
        this.project[0].stuUSNs = this.stuUSNs;
        this.project[0].students = this.studs.value;
      }

      else{
        this.stuInvalid = true;
      }
    }

    saveBasicDetails(){
      if(this.basicForm.valid){
        this.project[0].PRO_TITLE = this.proTitle.value;
        this.project[0].DEPARTMENT = this.department.value;
        this.project[0].YEAR = this.year.value;
        this.project[0].LEVEL = this.level.value;
        this.project[0].PRO_TYPE = this.type.value;
        this.project[0].BATCH = this.batch.value;
        this.project[0].SEMESTER = this.semester.value;
        this.project[0].GUIDE = this.guide.value;
      }
      else{
        this.basicInavlid = true;
      }
    }

    saveTechs(){
      if(this.technologyForm.valid){
        this.project[0].technologies = this.technologies.value;
      }
      else{
        this.techInvalid = true;
      }
    }

    saveDocs(){
      if(this.documentsForm.valid){
        this.project[0].SYNOPSIS = this.newSynopsis
        this.project[0].DIS_SYNOPSIS = this.dis_synopsis.value
        this.project[0].REPORT = this.newReport
        this.project[0].DIS_REPORT = this.dis_report.value
        this.project[0].PPT = this.newPpt
        this.project[0].DIS_PPT = this.dis_ppt.value
      }
      else{
        this.docsInvalid = true;
      }
    }

    onSynopsisSelect(event){
      this.newSynopsis = event.target.files[0];
    }

    onReportSelect(event){
      this.newReport = event.target.files[0];
    }

    onPptSelect(event){
      this.newPpt = event.target.files[0];
    }

    getStudent:student[]=[];
    fillStudent(index){

        var array= this.studs.value;
        this.getStudent = this.localStudentsarray.filter(function(stu: student){
          return stu.USN.toUpperCase()==array[index].USN.toUpperCase()
        })

        if(this.getStudent.length==0){
          if(array[index].USN.length == 10){
            this.newStudents.push(array[index].USN)
          }
        }

        else{
          this.studs.at(index).get('NAME').setValue(this.getStudent[0].NAME);
          this.studs.at(index).get('EMAIL').setValue(this.getStudent[0].EMAIL);
          this.studs.at(index).get('MOBILE_NO').setValue( this.getStudent[0].MOBILE_NO);
          this.studs.at(index).get('ACADEMIC_BATCH').setValue(this.getStudent[0].ACADEMIC_BATCH);
          this.studs.at(index).get('OLDUSN').setValue(this.getStudent[0].USN);
        }

    }

    isOld(usn){
      for(var i=0; i<this.localStudentsarray.length; i++){
        if(this.localStudentsarray[i].USN == usn){
          return true;
        }
      }
      return false;
    }

    returnBlob(res){
      return new Blob([res], {type: 'application/pdf'})
    }

    returnPPTBlob(res){
      return new Blob([res], {type: 'application/vnd.ms-powerpoint' })
    }

    viewSynopsis(){
      if(this.synopsis.value){
        this.proService.viewPdf(this.synopsis.value).subscribe(res=>{
          const url = window.URL.createObjectURL(this.returnBlob(res));
          window.open(url)
        }, err=>{
          this.notfound = true;
          setTimeout(()=>{
            this.notfound=false;
          },5000)
          window.scroll(0,0);
        })
      }
    }

    viewReport(){
      if(this.report.value){
        this.proService.viewPdf(this.report.value).subscribe(res=>{
          const url = window.URL.createObjectURL(this.returnBlob(res));
          window.open(url)
        }, err=>{
          this.notfound = true;
          setTimeout(()=>{
            this.notfound=false;
          },5000)
        })
      }
    }

    viewPpt(){
      console.log(this.ppt.value)
      if(this.ppt.value){
        var ext = this.ppt.value.split('.').pop();
        this.proService.viewPdf(this.ppt.value).subscribe(res=>{
        var url;
        if(ext=='pptx'|| ext == 'ppt'){
           url = window.URL.createObjectURL(this.returnPPTBlob(res));
        }else if(ext=='pdf'){
           url = window.URL.createObjectURL(this.returnBlob(res));
        }
        window.open(url)
      }, err=>{
          this.notfound = true;
          setTimeout(()=>{
            this.notfound=false;
          },5000)
        })
      }
    }


    onSubmit(){
      this.distinct = [];
      var oldStus: any[] = [];

      for(var i=0; i<this.studs.value.length; i++){
        var num=0;
        for(var j=0; j<this.oldStudents.length; j++){
          if(this.studs.value[i].OLDUSN === this.oldStudents[j].USN || this.isOld(this.studs.value[i].USN)){
            num++;
            break;
          }
        }
        if(num!=0){
          oldStus.push(this.studs.at(i).value);
        }

      }

      for(var i=0; i<this.studs.length; i++){
        this.studs.at(i).get('USN').enable();
      }

      for(var i=0; i<this.studs.value.length; i++){
        if(this.studs.value[i].OLDUSN=="")
        this.distinct.push(this.studs.at(i).value);
      }

      this.project[0].UPDATED_AT = new Date();
      this.project[0].oldStus =oldStus;
      this.project[0].distinctStuds = this.distinct;

      this.proId = (this.basicForm.get('YEAR').value % 100 + "" + this.level.value + "" + this.department.value + "" + this.semester.value + "" + this.type.value)

      console.log(this.proId,this.basicForm.get('YEAR').value);
      if(this.batch.disabled){
        var lev = this.basicForm.get('LEVEL').value
        var type = this.basicForm.get('PRO_TYPE').value

        var count = this.allPros.filter(function(pro:project){
          return (pro.PRO_TYPE == type) && (pro.LEVEL == lev)
        })
        this.proId = this.proId +""+ count.length;
      }
      else{
        this.proId = this.proId +""+ this.batch.value;
      }

      var proID = this.proId
      if(this.proId == this.projectCopy[0].PRO_ID){
        this.project[0].OLD_PRO_ID = this.projectCopy[0].PRO_ID;
        this.project[0].PRO_ID = this.proId
      }
      else{
        var found = this.allPros.filter(function(pro:project){
          return pro.PRO_ID == proID
        })

        if(found.length){
          this.exist = true
          console.log("hello");
        }
        else{
          this.project[0].OLD_PRO_ID = this.projectCopy[0].PRO_ID;
          this.project[0].PRO_ID = this.proId
        }
      }

      var user = this.userServe.userDetail
      this.project[0].uname = user.NAME
      console.log("IIIIIIII",this.project[0]);
      this.proService.updateProject(this.project[0]).subscribe((result:res) => {
        console.log("IIIIIIII",this.project[0]);
        if(result.statusCode == 200){
          const formData= new FormData();

          formData.append('SYNOPSIS',this.project[0].SYNOPSIS);
          formData.append('REPORT',this.project[0].REPORT);
          formData.append('PPT',this.project[0].PPT);
          formData.append('proId', this.project[0].PRO_ID);

          this.proService.uploadDocs(formData).subscribe((result:res)=>{
            this.initialize();
            this.fail = false;
            this.success=true;
            setTimeout(() => {
              this.success=false;
            }, 5000);
          })


        }
      }, err=>{
        this.fail = true;
        setTimeout(() => {
          this.fail = false;
        }, 5000);
      })

      window.scroll(0,0);

    }


  }
