import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:5000/api/jobs';  // Adjust the URL as per your server setup

  constructor(private http: HttpClient,private authService: AuthService) {}

  createJob(jobData: any, token: string): Observable<any> {
    // Set the token in the Authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/`, jobData, { headers });
  }
  getJobs(): Observable<any> {
    // Get the token from AuthService
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl, { headers });
  }
}
