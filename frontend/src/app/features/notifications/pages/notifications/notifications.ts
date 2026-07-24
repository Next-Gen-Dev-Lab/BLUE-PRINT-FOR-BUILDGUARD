import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SystemNotification } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-notifications-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsCenterComponent implements OnInit {
  notifications: SystemNotification[] = [];
  filteredNotifications: SystemNotification[] = [];
  isLoading = true;

  // Search & Filter parameters
  searchQuery = '';
  typeFilter = '';

  constructor(
    private readonly notificationService: NotificationService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (list) => {
        this.notifications = list;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.notifications];

    // Search query filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (this.typeFilter) {
      result = result.filter(n => n.type === this.typeFilter);
    }

    this.filteredNotifications = result;
  }

  markAsRead(id: string): void {
    this.notificationService.markNotificationAsRead(id).subscribe({
      next: () => {
        this.toast.success('Notification marked read.');
        this.loadNotifications();
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.toast.success('All notifications marked as read.');
        this.loadNotifications();
      }
    });
  }

  clearAll(): void {
    this.notificationService.clearNotifications().subscribe({
      next: () => {
        this.toast.info('Notifications cleared.');
        this.loadNotifications();
      }
    });
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'safety': return 'badge-danger';
      case 'project': return 'badge-info';
      case 'inspection': return 'badge-warning';
      case 'approval': return 'badge-success';
      default: return 'badge-gray';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'safety': return 'Safety Violation';
      case 'project': return 'Project Update';
      case 'inspection': return 'Site Inspection';
      case 'approval': return 'Admin Approval';
      default: return type;
    }
  }
}
