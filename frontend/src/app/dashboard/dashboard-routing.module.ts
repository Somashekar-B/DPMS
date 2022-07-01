import { PrintProjectsComponent } from './print-projects/print-projects.component';
import { ProjectDetailViewComponent } from './project-detail-view/project-detail-view.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AdminGuardGuard } from './../admin-guard.guard';
import { ViewProjectTypesComponent } from './view-project-types/view-project-types.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { HomeComponent } from './home/home.component';
import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component'
import { AddProjectTypeComponent } from './add-project-type/add-project-type.component';
import {ProfileComponent} from './profile/profile.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentProjectDetailComponent } from './student-project-detail/student-project-detail.component';

const routes: Routes = [

      { path: 'dashboard', component: HomeComponent, canActivate:[AdminGuardGuard] },
      { path: 'project-details/:proId', component: ProjectDetailViewComponent, canActivate:[AdminGuardGuard] },
      { path: 'view-projects', component: ViewProjectsComponent, canActivate:[AdminGuardGuard] },
      { path: 'printProjects', component: PrintProjectsComponent, canActivate: [AdminGuardGuard] },
      { path: 'add-user', component: AddUserComponent, canActivate:[AdminGuardGuard] },
      { path: 'add-user/:username', component: AddUserComponent, canActivate:[AdminGuardGuard] },
      { path: 'view-all-users', component: ViewUsersComponent, canActivate:[AdminGuardGuard] },
      { path: 'add-project-type', component: AddProjectTypeComponent, canActivate:[AdminGuardGuard] },
      { path: 'update-project-type', component: AddProjectTypeComponent, canActivate:[AdminGuardGuard] },
      { path: 'add-projects', component: AddProjectComponent, canActivate:[AdminGuardGuard]},
      { path: 'view-project-types', component: ViewProjectTypesComponent, canActivate:[AdminGuardGuard] },
      { path: 'profile', component: ProfileComponent, canActivate:[AdminGuardGuard]},
      { path: 'forget-password', component: ForgetPasswordComponent},
      { path: 'create-student-account', component: AddStudentComponent},
      { path: 'reset-password/:email/:token', component: ResetPasswordComponent},
      { path: 'add-review', component: AddReviewComponent, canActivate:[AdminGuardGuard] },
      { path: 'update-review', component: AddReviewComponent, canActivate:[AdminGuardGuard] },
      { path: 'account-requests', component: AccountRequestsComponent, canActivate: [AdminGuardGuard] },
      { path: 'projects-blog', component: StudentHomeComponent, canActivate: [AdminGuardGuard] },
      { path: 'project/:proId', component: StudentProjectDetailComponent, canActivate:[AdminGuardGuard] },

      { path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
