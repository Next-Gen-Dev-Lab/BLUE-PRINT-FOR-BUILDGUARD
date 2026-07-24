import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProjectService } from '../../../../core/services/project.service';
import { InspectionService } from '../../../../core/services/inspection.service';
import { SafetyViolationService } from '../../../../core/services/safety-violation.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Project, Inspection, SafetyAlert } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  protected readonly Math = Math;
  projects: Project[] = [];
  selectedProjectId: string = '';
  selectedProject?: Project;

  isLoading = true;
  isGenerating = false;
  reportGenerated = false;

  // Report Configuration
  reportType: 'daily' | 'weekly' | 'monthly' | 'progress' | 'safety' | 'compliance' = 'daily';
  startDate: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default 7 days ago
  endDate: string = new Date().toISOString().split('T')[0];
  includeImages = true;
  includeComments = true;

  // Compiled metrics for preview
  reportData = {
    projectName: '',
    generatedAt: '',
    complianceScore: 100,
    progressPercent: 0,
    totalAudits: 0,
    passedAudits: 0,
    failedAudits: 0,
    safetyAlertsFlagged: 0,
    safetyAlertsResolved: 0,
    activeAlerts: [] as SafetyAlert[],
    recentInspections: [] as Inspection[]
  };

  constructor(
    private readonly projectService: ProjectService,
    private readonly inspectionService: InspectionService,
    private readonly safetyViolationService: SafetyViolationService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projs) => {
        this.projects = projs;
        if (projs.length > 0) {
          this.selectedProjectId = projs[0].id;
          this.selectedProject = projs[0];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onProjectChange(): void {
    this.selectedProject = this.projects.find(p => p.id === this.selectedProjectId);
    this.reportGenerated = false; // Reset preview on parameter change
  }

  generateReport(): void {
    if (!this.selectedProjectId) {
      this.toast.warning('Please select a project site.');
      return;
    }

    this.isGenerating = true;
    
    // Simulate compilation latency
    setTimeout(() => {
      const proj = this.selectedProject;
      if (!proj) {
        this.isGenerating = false;
        return;
      }

      this.reportData.projectName = proj.name;
      this.reportData.generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      this.reportData.complianceScore = proj.complianceScore;
      this.reportData.progressPercent = proj.progress;

      // Pull inspections and safety alerts in parallel to compile counts
      forkJoin({
        insps: this.inspectionService.getInspections(),
        alerts: this.safetyViolationService.getSafetyViolations()
      }).subscribe({
        next: ({ insps, alerts }) => {
          const projInsps = insps.filter(i => i.projectId === proj.id);
          this.reportData.totalAudits = projInsps.length;
          this.reportData.passedAudits = projInsps.filter(i => i.status === 'passed').length;
          this.reportData.failedAudits = projInsps.filter(i => i.status === 'failed').length;
          this.reportData.recentInspections = projInsps.slice(0, 3);

          const projAlerts = alerts.filter(a => a.projectId === proj.id);
          this.reportData.safetyAlertsFlagged = projAlerts.length;
          this.reportData.safetyAlertsResolved = projAlerts.filter(a => a.status === 'resolved').length;
          this.reportData.activeAlerts = projAlerts.filter(a => a.status !== 'resolved');

          this.isGenerating = false;
          this.reportGenerated = true;
          this.toast.success('Report compiled successfully.');
        },
        error: () => {
          this.isGenerating = false;
          this.toast.error('Failed to compile report data.');
        }
      });
    }, 1200);
  }

  getReportTitle(): string {
    switch (this.reportType) {
      case 'daily': return 'Daily Operations Log Sheet';
      case 'weekly': return 'Weekly Safety & Operations Report';
      case 'monthly': return 'Monthly Site Compliance Executive Summary';
      case 'progress': return 'Construction Milestone Progress Audit';
      case 'safety': return 'AI Safety Hazards Assessment Report';
      case 'compliance': return 'Regulatory Code Compliance Ledger';
      default: return 'Site Operations Audit';
    }
  }

  exportPDF(): void {
    this.toast.info(`Exporting PDF: ${this.getReportTitle().replace(/\s+/g, '_')}.pdf...`);
  }

  printReport(): void {
    window.print();
  }
}
