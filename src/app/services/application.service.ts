import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Assuming AuthService handles user authentication

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/applications';  // Adjust URL to your backend API

  constructor(
    private http: HttpClient,
    private authService: AuthService  // Assuming you need the token for authentication
  ) {}

  getMyApplications(): Observable<any> {
    const token = this.authService.getToken();  // Get the auth token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/applications`, { headers });
  }
}
