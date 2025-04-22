import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-create-job',
  imports: [ReactiveFormsModule, CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent {
  createJobForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService  // Inject AuthService to get token
  ) {
    this.createJobForm = this.fb.group({
      position: ['', Validators.required],
      ctc: ['', [Validators.required, Validators.min(1)]],
      openings: ['', [Validators.required, Validators.min(1)]],
      department: ['', Validators.required],
      technologies: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.createJobForm.valid) {
      const jobData = this.createJobForm.value;

      // Get the token from the AuthService
      const token = this.authService.getToken();

      if (!token) {
        this.errorMessage = 'You need to be logged in to create a job.';
        return;
      }

      this.jobService.createJob(jobData, token).subscribe(
        response => {
          console.log('Job created successfully!', response);
          this.createJobForm.reset();
        },
        error => {
          this.errorMessage = 'Error creating job, please try again later.';
          console.error('Error:', error);
        }
      );
    }
  }
}
