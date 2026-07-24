import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { SystemNotification, User } from '../../core/models';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs';
import { getInitials } from '../../core/utils';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbsComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  breadcrumbs: Breadcrumb[] = [];
  notifications: SystemNotification[] = [];
  unreadCount: number = 0;
  currentUser: User | null = null;
  isDarkTheme = false;

  // Dropdown states
  isNotificationOpen = false;
  isProfileOpen = false;

  @ViewChild('notificationMenu') notificationMenu!: ElementRef;
  @ViewChild('profileMenu') profileMenu!: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.calculateBreadcrumbs(this.router.url);

    // Initial check for theme
    this.isDarkTheme = localStorage.getItem('bg_theme') === 'dark';
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Watch router events to update breadcrumbs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.calculateBreadcrumbs(event.url);
    });

    // Sub to notification service
    this.notificationService.getNotifications().subscribe();
    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(n => !n.isRead).length;
    });

    // Sub to user info
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Handle clicking outside to close dropdowns
  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.isNotificationOpen && this.notificationMenu && !this.notificationMenu.nativeElement.contains(event.target)) {
      this.isNotificationOpen = false;
    }
    if (this.isProfileOpen && this.profileMenu && !this.profileMenu.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
  }

  calculateBreadcrumbs(url: string): void {
    const segments = url.split('/').filter(p => p && p !== 'dashboard');
    const crumbs: Breadcrumb[] = [{ label: 'Dashboard', url: '/dashboard' }];
    
    let runningUrl = '/dashboard';
    segments.forEach((seg, index) => {
      // Clean display label
      let label = seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' ');
      // If it looks like an ID parameter (like p1, sa1)
      if (/^[a-z]\d+$/i.test(seg)) {
        label = `Details (${seg.toUpperCase()})`;
      }

      runningUrl += `/${seg}`;
      crumbs.push({ label, url: runningUrl });
    });

    this.breadcrumbs = crumbs;
  }

  toggleNotificationDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;
    this.isProfileOpen = false;
  }

  toggleProfileDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
    this.isNotificationOpen = false;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.toast.success('All notifications marked as read.');
    });
  }

  markAsRead(notif: SystemNotification, event: MouseEvent): void {
    event.stopPropagation(); // Avoid triggering link click navigation
    this.notificationService.markNotificationAsRead(notif.id).subscribe(() => {
      if (notif.relatedLink) {
        this.isNotificationOpen = false;
        this.router.navigate([notif.relatedLink]);
      }
    });
  }

  clearNotifications(): void {
    this.notificationService.clearNotifications().subscribe(() => {
      this.toast.info('Notifications cleared.');
    });
  }

  getInitials(name?: string): string {
    return getInitials(name);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('bg_theme', 'dark');
      this.toast.info('Theme set to Dark Mode');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('bg_theme', 'light');
      this.toast.info('Theme set to Light Mode');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
