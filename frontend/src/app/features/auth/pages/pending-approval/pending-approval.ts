import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pending-approval.html',
  styleUrls: ['./pending-approval.css']
})
export class PendingApprovalComponent implements OnInit {
  pendingUser: User | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.pendingUser = this.authService.getPendingApprovalUser();
    
    // Fallback in case they visit directly
    if (!this.pendingUser) {
      this.pendingUser = {
        id: 'u_temp',
        name: 'Guest Operator',
        employeeId: 'EMP-XXXX',
        companyName: 'Apex Builders Inc.',
        email: 'your.email@company.com',
        phone: '+1 (555) 000-0000',
        role: 'engineer',
        status: 'pending'
      };
    }
  }

  getRoleLabel(role?: string): string {
    if (!role) return '';
    switch (role) {
      case 'admin': return 'Safety Administrator';
      case 'engineer': return 'Project Engineer';
      case 'inspector': return 'Safety Inspector';
      case 'foreman': return 'Site Foreman';
      default: return role;
    }
  }
}
