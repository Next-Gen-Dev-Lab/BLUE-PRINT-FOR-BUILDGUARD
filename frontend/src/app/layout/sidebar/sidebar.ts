import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';
import { getInitials, getUserRoleLabel } from '../../core/utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  @Input() isMobileOpen: boolean = false;
  
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();
 
  currentUser: User | null = null;
 
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
 
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
 
  onToggle(): void {
    this.toggleCollapse.emit();
  }
 
  onLinkClick(): void {
    this.closeMobile.emit();
  }
 
  logout(): void {
    this.authService.logout();
    this.closeMobile.emit();
    this.router.navigate(['/auth/login']);
  }
 
  getUserRoleLabel(role?: string): string {
    return getUserRoleLabel(role);
  }
 
  getInitials(name?: string): string {
    return getInitials(name);
  }

  hasAccess(menuItem: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    if (role === 'admin') return true;
    if (role === 'engineer' || role === 'inspector') {
      const allowed = ['dashboard', 'projects', 'blueprints', 'progress-logs', 'inspections', 'safety', 'schedules', 'notifications', 'ai-review', 'reports', 'email', 'settings'];
      return allowed.includes(menuItem);
    }
    if (role === 'foreman') {
      const allowed = ['dashboard', 'projects', 'progress-logs', 'schedules', 'notifications', 'settings'];
      return allowed.includes(menuItem);
    }
    return false;
  }
}
