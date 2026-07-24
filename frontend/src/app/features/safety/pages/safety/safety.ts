import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafetyViolationService } from '../../../../core/services/safety-violation.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SafetyAlert } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { FilterOpenAlertsPipe } from '../../../../shared/pipes/filter-open-alerts.pipe';
import { FilterResolvedAlertsPipe } from '../../../../shared/pipes/filter-resolved-alerts.pipe';

@Component({
  selector: 'app-safety-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, FilterOpenAlertsPipe, FilterResolvedAlertsPipe],
  templateUrl: './safety.html',
  styleUrls: ['./safety.css']
})
export class SafetyCenterComponent implements OnInit {
  alerts: SafetyAlert[] = [];
  filteredAlerts: SafetyAlert[] = [];
  
  isLoading = true;
  isResolving = false;

  // Filters State
  categoryFilter = '';
  severityFilter = '';

  // Gauges values
  complianceScore = 88;
  openAlertsCount = 0;
  resolvedAlertsCount = 0;

  // Action Resolve Overlay state
  selectedAlert: SafetyAlert | null = null;
  resolutionComment = '';

  // SVG Gauge calculations
  gaugeRadius = 60;
  gaugeCircumference = 2 * Math.PI * 60; // 376.99
  gaugeOffset = 376.99;

  constructor(
    private readonly safetyViolationService: SafetyViolationService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAlertsData();
  }

  loadAlertsData(): void {
    this.isLoading = true;
    this.safetyViolationService.getSafetyViolations().subscribe({
      next: (res) => {
        this.alerts = res;
        this.calculateMetrics();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  calculateMetrics(): void {
    const open = this.alerts.filter(a => a.status === 'open' || a.status === 'investigating');
    const resolved = this.alerts.filter(a => a.status === 'resolved');
    
    this.openAlertsCount = open.length;
    this.resolvedAlertsCount = resolved.length;

    // Simulate compliance score based on unresolved alerts
    // Starts at 100, drops by 12 points for critical alert, 8 points for high, 4 points for medium
    let score = 100;
    open.forEach(a => {
      if (a.severity === 'critical') score -= 12;
      else if (a.severity === 'high') score -= 8;
      else if (a.severity === 'medium') score -= 4;
    });

    this.complianceScore = Math.max(20, score);
    this.gaugeOffset = this.gaugeCircumference - (this.complianceScore / 100) * this.gaugeCircumference;
  }

  applyFilters(): void {
    let result = [...this.alerts];

    if (this.categoryFilter) {
      result = result.filter(a => a.category === this.categoryFilter);
    }

    if (this.severityFilter) {
      result = result.filter(a => a.severity === this.severityFilter);
    }

    this.filteredAlerts = result;
  }

  openResolveModal(alert: SafetyAlert): void {
    this.selectedAlert = alert;
    this.resolutionComment = '';
  }

  closeResolveModal(): void {
    this.selectedAlert = null;
    this.resolutionComment = '';
  }

  submitResolution(): void {
    if (!this.selectedAlert || !this.resolutionComment.trim()) {
      this.toast.warning('Please input a resolution comment describing changes made.');
      return;
    }

    this.isResolving = true;
    const updatedAlert: SafetyAlert = {
      ...this.selectedAlert,
      status: 'resolved',
      comments: [...(this.selectedAlert.comments || []), this.resolutionComment]
    };

    this.safetyViolationService.createSafetyViolation(updatedAlert).subscribe({
      next: () => {
        this.isResolving = false;
        this.toast.success('Compliance warning resolved.');
        this.loadAlertsData();
        this.closeResolveModal();
      },
      error: (err) => {
        this.isResolving = false;
        this.toast.error(err.message || 'Error executing resolution.');
      }
    });
  }

  getSeverityClass(sev: string): string {
    switch (sev.toLowerCase()) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'medium': return 'sev-medium';
      case 'low': return 'sev-low';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'investigating': return 'status-investigating';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  }
}
