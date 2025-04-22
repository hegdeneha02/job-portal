import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // adjust path as needed

@Component({
  selector: 'app-view-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-applications.component.html',
  styleUrls: ['./view-applications.component.css']
})
export class ViewApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private authService: AuthService,private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    const role = this.authService.isAdmin();
    if (role !== true) {
      if (isPlatformBrowser(this.platformId)) {
        alert('Access Denied. Only admin can view this page.');
      }
      this.router.navigate(['/']); // Redirect to home page (or another appropriate page)
      return;  // Exit the function if the user is not an admin
    }
    const token = this.authService.getToken(); // or localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:5000/api/applications/view-application', { headers })
      .subscribe({
        next: (data) => {
          this.applications = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching applications:', err);
          this.loading = false;
        }
      });
  }

  viewResume(applicationId: string): void {
    const apiUrl = `http://localhost:5000/api/applications/resume/${applicationId}`;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiUrl, { headers, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download resume:', err);
      }
    });
  }
  updateStatus(applicationId: string, newStatus: string): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = `http://localhost:5000/api/applications/update/${applicationId}`;
  
    this.http.put(apiUrl, { status: newStatus }, { headers }).subscribe({
      next: () => {
        // Optionally update status in UI or re-fetch applications
        const app = this.applications.find(a => a._id === applicationId);
        if (app) app.status = newStatus;
        alert(`Application ${newStatus}`);
      },
      error: (err) => {
        console.error(`Failed to update status:`, err);
        alert('Something went wrong while updating status.');
      }
    });
  }
  
}
