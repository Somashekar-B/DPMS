import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mdb from 'mdb-ui-kit'; // lib
//import { Dropdown } from 'mdb-ui-kit'; // module
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AddUserComponent } from './add-user/add-user.component';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewUsersComponent } from './view-users/view-users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddProjectComponent } from './add-project/add-project.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AddProjectTypeComponent } from './add-project-type/add-project-type.component';
import { ViewProjectTypesComponent } from './view-project-types/view-project-types.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProjectDetailViewComponent } from './project-detail-view/project-detail-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PrintProjectsComponent } from './print-projects/print-projects.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentProjectDetailComponent } from './student-project-detail/student-project-detail.component'

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [AddUserComponent, HomeComponent, SidenavComponent, ViewUsersComponent, AddProjectComponent, ViewProjectsComponent, AddProjectTypeComponent, ViewProjectTypesComponent, ProfileComponent, ForgetPasswordComponent, ResetPasswordComponent, ProjectDetailViewComponent, PrintProjectsComponent, AddReviewComponent, AddStudentComponent, AccountRequestsComponent, StudentHomeComponent, StudentProjectDetailComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FontAwesomeModule,
    HttpClientModule,
    DataTablesModule,
    PdfViewerModule,
  ],

  exports: [
    AddUserComponent,
    HomeComponent,
    SidenavComponent,
    ViewUsersComponent,
    AddProjectComponent,
    ViewProjectsComponent,
    ViewProjectTypesComponent,
  ]
})
export class DashboardModule { }
