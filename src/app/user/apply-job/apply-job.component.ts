import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {
  applyForm: FormGroup;
  jobId: string | null = null;
  submitted: boolean = false;
  resumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.applyForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      experience: ['', Validators.required],
      resume: [null, Validators.required]
    });
  }
 

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
  }
  

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.resumeFile = file;
      this.applyForm.patchValue({ resume: file }); // update form control for validation
    } else {
      this.resumeFile = null;
      this.applyForm.patchValue({ resume: null });
      alert('Please upload a valid PDF file.');
    }
  }
  

  onSubmit(): void {
    this.submitted = true;
  
    if (this.applyForm.invalid || !this.resumeFile) {
      return;
    }
  
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
  
    const formData = new FormData();
    formData.append('fullName', this.applyForm.value.fullName);
    formData.append('email', this.applyForm.value.email);
    formData.append('phone', this.applyForm.value.phone);
    formData.append('address', this.applyForm.value.address);
    formData.append('dateOfBirth', this.applyForm.value.dateOfBirth);
    formData.append('gender', this.applyForm.value.gender);
    formData.append('education', this.applyForm.value.education);
    formData.append('experience', this.applyForm.value.experience);
    formData.append('jobId', this.jobId || '');
    formData.append('resume', this.resumeFile);
  
    this.http.post('http://localhost:5000/api/applications/apply', formData, { headers })
      .subscribe({
        next: () => {
          alert('Application submitted successfully!');
          this.applyForm.reset();
          this.resumeFile = null;
          this.submitted = false;
        },
        error: (err) => {
          console.error('Submission error:', err);
  
          // Handle different types of errors
          if (err.status === 400) {
            alert('Bad request. Please check your form and try again.');
          } else if (err.status === 401) {
            alert('Unauthorized. Please login to submit the application.');
          } else if (err.status === 500) {
            alert('Server error. Please try again later.');
          } else {
            alert('Failed to submit application. Please try again later.');
          }
        }
      });
  }
  
  
}
