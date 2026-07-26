import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is already logged in with a valid session
    const cachedUser = localStorage.getItem('bg_current_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        const validRoles = ['foreman', 'engineer', 'inspector', 'admin'];
        if (parsed && parsed.id && parsed.role && validRoles.includes(parsed.role)) {
          this.router.navigate(['/dashboard']);
          return;
        }
      } catch {
        // fall through
      }
      // Stale or invalid session — clear it
      localStorage.removeItem('bg_current_user');
      localStorage.removeItem('bg_jwt_token');
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.toast.success(`Welcome back, ${user.name}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.extractErrorMessage(err);
        this.toast.error(this.errorMessage);
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Unable to connect to the server. Please ensure the backend service is running.';
    }
    if (err?.status === 400 || err?.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (err?.status === 403) {
      return 'Your account is pending approval or has been suspended. Contact your administrator.';
    }
    return err?.error?.message || err?.message || 'Login failed. Please check your credentials.';
  }
}
