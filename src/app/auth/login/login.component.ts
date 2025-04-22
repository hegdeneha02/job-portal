import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.error = ''; // Reset error message before attempting login

    // Call the login method from AuthService
    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: res => {
          // Store the user data and token in localStorage
          this.auth.setSession(res.token, res.user);

          // Redirect based on role after login
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin/create-job']); // Redirect to admin page if admin
          } else {
            this.router.navigate(['/jobs']); // Redirect to job listing page if regular user
          }
        },
        error: err => {
          // Display error message if login fails
          this.error = err.error?.message || 'Login failed. Please try again.';
        }
      });
  }
}
