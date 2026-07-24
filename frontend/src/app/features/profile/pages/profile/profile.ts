import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { User } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  isEditing = false;
  isUpdatingProfile = false;
  isUpdatingPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    // Get currentUser session
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initializeProfileForm(user);
      }
    });

    this.initializePasswordForm();
  }

  initializeProfileForm(user: User): void {
    this.profileForm = this.fb.group({
      name: [user.name, Validators.required],
      phone: [user.phone, [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
      email: [{ value: user.email, disabled: true }],
      employeeId: [{ value: user.employeeId, disabled: true }],
      companyName: [{ value: user.companyName, disabled: true }],
      role: [{ value: user.role, disabled: true }]
    });
  }

  initializePasswordForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmNewPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentUser) {
      // Revert values
      this.initializeProfileForm(this.currentUser);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isUpdatingProfile = true;
    const { name, phone } = this.profileForm.value;

    this.authService.updateProfile({ name, phone }).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isEditing = false;
        this.isUpdatingProfile = false;
        this.toast.success('Profile details updated successfully.');
      },
      error: (err) => {
        this.isUpdatingProfile = false;
        this.toast.error(err.message || 'Error updating profile.');
      }
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isUpdatingPassword = true;

    // Simulate password updates latency
    setTimeout(() => {
      this.isUpdatingPassword = false;
      this.passwordForm.reset();
      this.toast.success('Account password updated successfully.');
    }, 1200);
  }

  getUserRoleLabel(role?: string): string {
    if (!role) return '';
    switch (role) {
      case 'admin': return 'Safety Admin';
      case 'engineer': return 'Project Engineer';
      case 'inspector': return 'Safety Inspector';
      case 'foreman': return 'Site Foreman';
      default: return role;
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'BG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
