import { Component, OnInit, OnChanges } from '@angular/core';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { res } from '../models/res.model';
import { StudentsService } from 'src/app/services/students.service';
import { SharedUrlService } from 'src/app/services/shared-url.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  host: {
    "(window:resize)":"onWindowResize($event)"
  },
})
export class SidenavComponent implements OnInit {
  bars: any;
  show: boolean;
  display:String;
  close: any;
  log: any
  result: any;
  user: any;
  requests: any;
  urlPrefix: String;


  constructor(
    private userServe: UserService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private stuServe: StudentsService,
    private sUrl: SharedUrlService
    ) {
    this.bars= faBars,
    this.close=faTimes
    this.show=true
    this.userServe.getDetails().subscribe((result:res)=>{
      this.user = result.body;
    })
  }

  ngOnInit(): void {
    this.stuServe.getRegisteredStudents().subscribe((result:res)=>{
      this.requests = result.body.length;
    });

  }


  onWindowResize(event){
    if(event.target.innerWidth<690){
      this.show=false;
      this.display="none"
    }
    else{
      this.show=true;
      this.display="block"
    }
  }

  getLeft(){
    if(this.show){
      return '220px'
    }

    return '30px'
  }

  toggleShow(){
    this.show=!this.show;
    if(this.show){
      this.display="block"
    }
    else{
      this.display="none"
    }
  }

  logout(){
    this.userServe.logout();
    this.router.navigate([''])
  }

}
