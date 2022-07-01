import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { AddStudentComponent } from '../dashboard/add-student/add-student.component';

const routes: Routes = [
  { path:'login', component: LoginComponent },
  // { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {

}
