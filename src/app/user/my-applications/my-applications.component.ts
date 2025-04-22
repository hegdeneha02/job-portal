import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';  // Service to interact with job applications
import { JobService } from '../../services/job.service';  // Service to interact with job data
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-applications',
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];  // Holds the list of applications
  errorMessage: string | null = null;

  constructor(
    private applicationService: ApplicationService,  // Service to manage applications
    private jobService: JobService  // Service to manage jobs
  ) { }

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.applicationService.getMyApplications().subscribe(
      (response: any[]) => {  // Assuming the response is an array of applications
        this.applications = response;
      },
      (error) => {
        this.errorMessage = 'Error fetching your applications. Please try again later.';
        console.error('Error:', error);
      }
    );
  }
}
