import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  passwordStrength: 'weak' | 'fair' | 'strong' = 'weak';
  passwordStrengthPercent = 20;

  roles = [
    { value: 'foreman', label: 'Site Foreman' },
    { value: 'engineer', label: 'Project Engineer' },
    { value: 'inspector', label: 'Safety Inspector' },
    { value: 'admin', label: 'Safety Administrator (Admin)' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue]
    });

    // Reactively calculate password strength
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.calculatePasswordStrength(val || '');
    });
  }

  calculatePasswordStrength(pass: string): void {
    if (!pass) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = 0;
      return;
    }

    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/\d/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    this.passwordStrengthPercent = score;

    if (score < 40) {
      this.passwordStrength = 'weak';
    } else if (score < 80) {
      this.passwordStrength = 'fair';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toast.success('Registration successful! Account pending admin approval.');
        this.router.navigate(['/auth/pending-approval']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.extractErrorMessage(err);
        this.toast.error(this.errorMessage);
      }
    });
  }

  private extractErrorMessage(err: any): string {
    // Network/connection failure (backend not running)
    if (err?.status === 0) {
      return 'Unable to connect to the server. Please ensure the backend service is running.';
    }
    // 409 Conflict — email already registered
    if (err?.status === 409) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    // 400 Bad Request — validation error from backend
    if (err?.status === 400) {
      const body = err?.error;
      if (typeof body === 'string' && body.length > 0) return body;
      if (body?.message) return body.message;
      if (body?.error) return body.error;
      return 'Invalid registration details. Please check your inputs and try again.';
    }
    // 403 Forbidden — registration endpoint blocked
    if (err?.status === 403) {
      return 'Registration is currently restricted. Contact your system administrator.';
    }
    // Fallback to any message available
    return err?.error?.message || err?.message || 'Registration failed. Please try again.';
  }
}
