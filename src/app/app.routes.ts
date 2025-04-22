import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CreateJobComponent } from './admin/create-job/create-job.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { JobListingsComponent } from './user/job-listings/job-listings.component';
import { MyApplicationsComponent } from './user/my-applications/my-applications.component';
import { ApplyJobComponent } from './user/apply-job/apply-job.component';
import { ViewApplicationsComponent } from './admin/view-applications/view-applications.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';


export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/create-job', component: CreateJobComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'jobs', component: JobListingsComponent, canActivate: [AuthGuard]}, 
  { path: 'my-applications', component: MyApplicationsComponent ,canActivate: [AuthGuard] },
  { path: 'apply/:jobId', component: ApplyJobComponent ,canActivate: [AuthGuard]},  
  {
    path: 'admin/view-applications',
    component: ViewApplicationsComponent
  },
  
];
