import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  isSent = false;
  successMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email } = this.forgotForm.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: (msg) => {
        this.isLoading = false;
        this.isSent = true;
        this.successMessage = msg;
        this.toast.success('Reset link dispatched.');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.message || 'Error executing request.');
      }
    });
  }
}
