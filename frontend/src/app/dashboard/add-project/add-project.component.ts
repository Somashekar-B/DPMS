import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { proType } from './../models/types.model';
import { project } from './../models/project.model';
import { res } from './../models/res.model';
import { StudentsService } from './../../services/students.service';
import { ProjectsService } from './../../services/projects.service';
import { student } from './../models/student.model';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  proId: string;
  exist: boolean;
  success: boolean;
  allPros: [];
  newStudents = [];
  advSub: boolean;
  localStudentsarray: [];
  allTechs: [];
  typesArray: proType[];
  showTypes: proType[];
  depCode: any;
  depName: any;
  fail: boolean;
  mySubscription: any;
  user: any;
  allUsers: any;

  constructor(
    private ProService: ProjectsService,
    private stuService: StudentsService,
    private formBuilder: FormBuilder,
    private userServe: UserService,
    private router: Router,
    private sUrl: SharedUrlService
  ){
    
    this.exist = false
    this.success = false
    this.advSub = false
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
   }

   ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.projectForm.reset();

    this.ProService.getAllTechs().subscribe((result: res) => {
      this.allTechs = result.body
      console.log(this.allTechs);
    })

     var year =  new Date().getFullYear();
     this.projectForm.get('year').setValue(year)

    this.stuService.getAllStudents().subscribe((result: res)=> {
      this.localStudentsarray = result.body
    })



    this.ProService.getProjectTypes().subscribe((result:res) => {
      this.typesArray = result.body
    })

    this.userServe.getDetails().subscribe((result:res)=>{
      this.userServe.setUser(result.body);
      this.user = result.body;
      this.setGuide();
      this.userServe.getAllUsers(this.userServe.userDetail.DEP_CODE).subscribe((result:res)=>{
        this.allUsers = result.body;
        // console.log(this.allUsers);
      })
      this.department.setValue(this.userServe.userDetail.DEP_CODE);
      this.depCode = this.userServe.userDetail.DEP_CODE;
      this.depName = this.userServe.userDetail.DEPARTMENT;
      this.ProService.fetchAllProjects(this.user).subscribe((result: res) => {
        this.allPros = result.body.allProjects
      })
    }, err=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401)
          this.router.navigate(['../']);
      }
    })
  }

  onSynopsisSelect(event){
    const file = event.target.files[0];
    this.projectForm.get('synopsis').setValue(file);
  }

  onReportSelect(event){
    const file = event.target.files[0];
    this.projectForm.get('report').setValue(file);
  }

  onPptSelect(event){
    const file = event.target.files[0];
    this.projectForm.get('ppt').setValue(file);
  }

  setGuide(){
    this.projectForm.get('guide').setValue(this.user.NAME);
  }
 // [Validators.pattern('[a-zA-Z[]() ]*')]
  projectForm = this.formBuilder.group({
    year: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]],
    proTitle: [''],
    department: ['', Validators.required],
    level: ['', [Validators.required]],
    type: ['', [Validators.required]],
    semester: ['', [Validators.required, Validators.min(1), Validators.max(8), Validators.maxLength(1)]],
    batch: ['', [Validators.required,Validators.pattern('[a-zA-Z][0-9]*'), Validators.maxLength(3), Validators.minLength(2)]],
    guide: ['', [Validators.pattern('[a-zA-Z. ]*')]],
    synopsis: [''],
    dis_synopsis: [''],
    report: [''],
    dis_report: [''],
    ppt: [''],
    dis_ppt: [''],
    technologies: this.formBuilder.array([
      this.formBuilder.control('',[Validators.required])
    ]),
    students: this.formBuilder.array([
      this.formBuilder.group({
        USN: ['', [Validators.required,Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
        NAME: ['', [Validators.pattern('[a-zA-Z ]*')]],
        MOBILE_NO: ['', [Validators.maxLength(10), Validators.minLength(10)]],
        EMAIL: ['', [Validators.email]],
        ACADEMIC_BATCH: ['', [Validators.maxLength(7)]]
      })
    ])

  });

  get proTitle(){return this.projectForm.get('proTitle')};
  get yr(){return this.projectForm.get('year')};
  get department(){return this.projectForm.get('department')};
  get level(){return this.projectForm.get('level')};
  get type(){return this.projectForm.get('type')};
  get semester(){return this.projectForm.get('semester')};
  get batch(){return this.projectForm.get('batch')};
  get guide(){return this.projectForm.get('guide')};
  get synopsis(){return this.projectForm.get('synopsis')};
  get dis_synopsis(){return this.projectForm.get('dis_synopsis')};
  get report(){return this.projectForm.get('report')};
  get dis_report(){return this.projectForm.get('dis_report')};
  get ppt(){return this.projectForm.get('ppt')};
  get dis_ppt(){return this.projectForm.get('dis_ppt')};
  get technologies(){return this.projectForm.get('technologies') as FormArray};
  get students(){return this.projectForm.get('students') as FormArray};

  newProject: any = {};
  different: student[];

  stuUSNs=[];
  batches: boolean;
  tempTypes: proType[];

  getTypes(level){
    this.showTypes = this.typesArray.filter(function(type){
      return type.LEVEL == level
    })

  }

  batchRequire(type,level){
    this.tempTypes = this.typesArray.filter(function(indiType){
      return ((indiType.TYPE_CODE == type) && (indiType.LEVEL == level))
    })
    if(!this.tempTypes[0].AVAIL_BATCHES){
      this.projectForm.get('batch').disable()
    }
    else{
      this.projectForm.get('batch').enable()
    }
  }



  addTech(){
    this.technologies.push(this.formBuilder.control('',[Validators.required]))
  }

  removeTech(index){
    this.technologies.removeAt(index)
  }

  makeTrue(){
    this.advSub=true
  }

  addStudent(){
    var newStudent = this.formBuilder.group({
      USN: ['', [Validators.required,Validators.pattern('([a-zA-Z]*[0-9]*)*'), Validators.maxLength(10), Validators.minLength(10)]],
      NAME: ['', [Validators.pattern('[a-zA-Z ]*')]],
      MOBILE_NO: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      EMAIL: ['', [Validators.email]],
      ACADEMIC_BATCH: ['',Validators.maxLength(7)]
    })
    this.students.push(newStudent);
  }

  removeForm(index){
    this.students.removeAt(index);
  }

  getStudent:student[]=[];
  fillStudent(index){
      var array= this.students.value;
      this.getStudent = this.localStudentsarray.filter(function(stu: student){
        return stu.USN.toUpperCase()==array[index].USN.toUpperCase()
      })

      if(this.getStudent.length==0){
        if(array[index].USN.length == 10){
          this.newStudents.push(array[index].USN.toUpperCase())
        }
      }

      else{
        this.students.at(index).get('NAME').setValue(this.getStudent[0].NAME);
        this.students.at(index).get('EMAIL').setValue(this.getStudent[0].EMAIL);
        this.students.at(index).get('MOBILE_NO').setValue( this.getStudent[0].MOBILE_NO);
        this.students.at(index).get('ACADEMIC_BATCH').setValue(this.getStudent[0].ACADEMIC_BATCH);
      }

  }


onSubmit(){
  const distinct: student[] = [];
  this.newStudents.forEach( usn => {
    this.different = this.students.value.filter(function(stu){
      return usn==stu.USN
    })

    if(this.different.length){
      if(!distinct.includes(this.different[0])){
        distinct.push(this.different[0]);
      }
    }
  })

  this.students.value.forEach(stu=>{
    this.stuUSNs.push(stu.USN.toUpperCase())
  })

  this.newProject.PRO_TITLE = this.projectForm.get('proTitle').value;
  this.newProject.YEAR = this.projectForm.get('year').value;
  this.newProject.DEPARTMENT = this.projectForm.get('department').value;
  this.newProject.LEVEL = this.projectForm.get('level').value;
  this.newProject.PRO_TYPE = this.projectForm.get('type').value;
  this.newProject.SEMESTER = this.projectForm.get('semester').value;
  this.newProject.BATCH = this.projectForm.get('batch').value;
  if(this.user.USERTYPE==='Admin')
    this.newProject.GUIDE = this.projectForm.get('guide').value;
  else
    this.newProject.GUIDE = this.user.NAME;
  this.newProject.SYNOPSIS = "";
  this.newProject.DIS_SYNOPSIS = this.projectForm.get('dis_synopsis').value;
  this.newProject.REPORT = "";
  this.newProject.DIS_REPORT = this.projectForm.get('dis_report').value;
  this.newProject.PPT = "";
  this.newProject.DIS_PPT = this.projectForm.get('dis_ppt').value;
  this.newProject.CREATED_AT = new Date();
  this.newProject.students = this.stuUSNs;
  this.newProject.distinctStuds = distinct;
  this.newProject.technologies = this.projectForm.get('technologies').value;

  this.proId = (this.projectForm.get('year').value % 100 + "" + this.level.value + "" + this.department.value + "" + this.semester.value + "" + this.type.value)

  if(this.batch.disabled){
    var lev = this.projectForm.get('level').value
    var type = this.projectForm.get('type').value

    var count = this.allPros.filter(function(pro:project){
      return (pro.PRO_TYPE == type) && (pro.LEVEL == lev)
    })
    this.proId = this.proId +""+ count.length;
  }
  else{
    this.proId = this.proId +""+ this.batch.value;
  }

  var proID = this.proId
  var found = this.allPros.filter(function(pro:project){
    return pro.PRO_ID == proID
  })

  if(found.length){
    this.exist = true;
    setTimeout(()=>{
      this.exist=false;
    },5000);
    window.scroll(0,0);
  }
  else{
    this.newProject.PRO_ID = this.proId
    var user = this.userServe.userDetail
    this.newProject.uname = user.NAME

    
    this.ProService.addProject(this.newProject).subscribe((result: res)=>{
      if(result.statusCode == 200){
        const formData= new FormData();

        formData.append('SYNOPSIS',this.projectForm.get('synopsis').value);
        formData.append('REPORT',this.projectForm.get('report').value);
        formData.append('PPT',this.projectForm.get('ppt').value);
        formData.append('proId', this.proId);

        this.ProService.uploadDocs(formData).subscribe((result:res)=>{
          this.fail = false;
          this.success=true;
          setTimeout(()=>{
            this.success=false;
            this.router.navigate(['../add-projects']);
          }, 1000);
        })

      }
    }, err=>{
      this.fail = true;
      this.success=false;
      setTimeout(()=>{
        this.fail = false
      }, 5000);

    })
    window.scroll(0,0);
  }
}

}
