import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '../../../../core/services/email.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-email-center',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email.html',
  styleUrls: ['./email.css']
})
export class EmailCenterComponent implements OnInit {
  emailForm!: FormGroup;
  isSending = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly emailService: EmailService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      recipient: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  sendEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      this.toast.warning('Please fix validation errors before sending.');
      return;
    }

    this.isSending = true;
    const { recipient, subject, message } = this.emailForm.value;

    this.emailService.sendEmail(recipient, subject, message).subscribe({
      next: () => {
        this.isSending = false;
        this.toast.success(`Compliance alert email successfully dispatched to ${recipient}!`);
        this.emailForm.reset();
      },
      error: (err) => {
        this.isSending = false;
        this.toast.error(err.message || 'Failed to dispatch email notice.');
      }
    });
  }
}
