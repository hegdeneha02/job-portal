import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-job-listings',
  imports: [CommonModule, RouterModule, NavbarComponent,FooterComponent],
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css']
})
export class JobListingsComponent implements OnInit {
  jobs: any[] = [];  // Use 'any' type for jobs array
  errorMessage: string | null = null;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.jobService.getJobs().subscribe(
      (response: any[]) => {  // Use 'any' type for the response
        this.jobs = response;
      },
      (error) => {
        this.errorMessage = 'Error fetching jobs. Please try again later.';
        console.error('Error:', error);
      }
    );
  }
}
