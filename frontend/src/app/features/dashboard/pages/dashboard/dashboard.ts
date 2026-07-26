import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { Project, Inspection, SafetyAlert, User } from '../../../../core/models';
import { KpiCardComponent } from '../../../../shared/components/cards/kpi-card/kpi-card';
import { ChartCardComponent } from '../../../../shared/components/charts/chart-card/chart-card';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

// Import live REST services
import { AuthService } from '../../../../core/services/auth.service';
import { ProjectService } from '../../../../core/services/project.service';
import { InspectionService } from '../../../../core/services/inspection.service';
import { SafetyViolationService } from '../../../../core/services/safety-violation.service';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
import { BlueprintService } from '../../../../core/services/blueprint.service';
import { DashboardService } from '../../../../core/services/dashboard.service';

interface TaskItem {
  id: string;
  task: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, KpiCardComponent, ChartCardComponent, LoadingSpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  projects: Project[] = [];
  inspections: Inspection[] = [];
  safetyAlerts: SafetyAlert[] = [];
  usersCount = 0;
  blueprintsCount = 0;
  schedules: any[] = [];
  notificationsList: any[] = [];
  unreadCount = 0;
  isLoading = true;

  // KPI values
  kpiStats = {
    totalProjects: 0,
    activeSites: 0,
    completedProjects: 0,
    pendingInspections: 0,
    completedInspections: 0,
    aiSafetyAlerts: 0,
    safetyViolations: 0,
    complianceScore: 0,
    workersOnSite: 145
  };

  // Weather data
  weatherMock = {
    temp: '78°F',
    condition: 'Sunny & Clear',
    location: 'Sector 7G Site',
    humidity: '42%',
    wind: '8 mph'
  };

  // Quick Tasks List
  tasksList: TaskItem[] = [
    { id: 't1', task: 'Check concrete strength report for Tower A Level 42', completed: false, priority: 'high' },
    { id: 't2', task: 'Review safety harness tie-off points with Zone B crew', completed: true, priority: 'high' },
    { id: 't3', task: 'Schedule structural framing audit on residential Block A', completed: false, priority: 'medium' },
    { id: 't4', task: 'Submit daily progress log report', completed: false, priority: 'medium' },
    { id: 't5', task: 'Order heavy cable protection ramps for overpass', completed: false, priority: 'low' }
  ];

  // Calendar dates
  calendarDays: number[] = [];
  currentMonthName = 'July 2026';

  // Chart configurations
  progressChartData = [24, 38, 48, 62, 70, 78];
  progressChartLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  inspectionChartData = [4, 6, 8, 5, 9, 7];
  inspectionChartLabels = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  constructor(
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private readonly inspectionService: InspectionService,
    private readonly safetyViolationService: SafetyViolationService,
    private readonly scheduleService: ScheduleService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly blueprintService: BlueprintService,
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // Generate simple calendar days (1 to 31)
    for (let i = 1; i <= 31; i++) {
      this.calendarDays.push(i);
    }

    // Subscribe to session
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    // Fetch live dashboard statistics and compile KPI stats
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    const userJson = localStorage.getItem('bg_current_user');
    const user = this.currentUser || (userJson ? JSON.parse(userJson) : null);
    const role = user ? user.role : '';

    const isAdmin = role === 'admin';
    const isEngineerOrInspector = role === 'engineer' || role === 'inspector';

    // Load initial sets in parallel using forkJoin
    const requests = {
      projects: this.projectService.getProjects().pipe(catchError(() => of([]))),
      inspections: (isAdmin || isEngineerOrInspector)
        ? this.inspectionService.getInspections().pipe(catchError(() => of([])))
        : of([]),
      violations: (isAdmin || isEngineerOrInspector)
        ? this.safetyViolationService.getSafetyViolations().pipe(catchError(() => of([])))
        : of([]),
      schedules: this.scheduleService.getSchedules().pipe(catchError(() => of([]))),
      notifications: this.notificationService.getNotifications().pipe(catchError(() => of([]))),
      users: isAdmin
        ? this.userService.getUsers().pipe(catchError(() => of([])))
        : of([]),
      blueprints: (isAdmin || isEngineerOrInspector)
        ? this.blueprintService.getBlueprints().pipe(catchError(() => of([])))
        : of([])
    };

    forkJoin(requests).subscribe({
      next: (res) => {
        this.projects = res.projects;
        this.inspections = res.inspections;
        this.safetyAlerts = res.violations;
        this.schedules = res.schedules;
        this.notificationsList = res.notifications;
        this.unreadCount = res.notifications.filter(n => !n.isRead).length;
        this.usersCount = res.users.length;
        this.blueprintsCount = res.blueprints.length;

        // Process KPIs locally
        this.kpiStats.totalProjects = this.projects.length;
        this.kpiStats.activeSites = this.projects.filter(p => p.status === 'active').length;
        this.kpiStats.completedProjects = this.projects.filter(p => p.status === 'completed').length;
        
        if (this.projects.length > 0) {
          const sum = this.projects.reduce((acc, curr) => acc + curr.complianceScore, 0);
          this.kpiStats.complianceScore = Math.round(sum / this.projects.length);
        } else {
          this.kpiStats.complianceScore = 88; // standard default avg
        }

        this.kpiStats.completedInspections = this.inspections.filter(i => i.status === 'passed' || i.status === 'failed').length;
        this.kpiStats.pendingInspections = this.inspections.filter(i => i.status === 'scheduled' || i.status === 'pending_review').length;

        this.kpiStats.aiSafetyAlerts = this.safetyAlerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
        this.kpiStats.safetyViolations = this.safetyAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

        // Optionally load dedicated /dashboard/admin endpoints if user is admin
        if (this.currentUser?.role === 'admin') {
          this.dashboardService.getAdminStats().subscribe({
            next: (adminStats) => {
              if (adminStats) {
                // Merge/override KPI properties returned from the live Spring Boot API
                this.kpiStats = { ...this.kpiStats, ...adminStats };
              }
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  toggleTask(task: TaskItem): void {
    task.completed = !task.completed;
  }
}
