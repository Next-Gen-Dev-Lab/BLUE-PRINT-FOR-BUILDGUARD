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
      employeeId: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });

    // Reactively calculate password strength
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.calculatePasswordStrength(val || '');
    });
  }

  // Custom validator for matching passwords
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { mismatch: true };
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
        this.errorMessage = err.message || 'Registration failed.';
        this.toast.error(this.errorMessage);
      }
    });
  }
}
