import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { BlueprintService } from '../../../../core/services/blueprint.service';
import { InspectionService } from '../../../../core/services/inspection.service';
import { SafetyViolationService } from '../../../../core/services/safety-violation.service';
import { Project, Inspection, Blueprint, SafetyAlert } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.css']
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  project?: Project;
  inspections: Inspection[] = [];
  blueprints: Blueprint[] = [];
  safetyAlerts: SafetyAlert[] = [];
  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly blueprintService: BlueprintService,
    private readonly inspectionService: InspectionService,
    private readonly safetyViolationService: SafetyViolationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id') || '';
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    this.isLoading = true;
    
    // Fetch project metadata
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (proj) => {
        if (!proj) {
          this.router.navigate(['/projects']);
          return;
        }
        this.project = proj;
        
        // Fetch blueprints for this project
        this.blueprintService.getBlueprints().subscribe(bps => {
          this.blueprints = bps.filter(b => b.projectId === this.projectId);
        });

        // Fetch inspections for this project
        this.inspectionService.getInspections().subscribe(ins => {
          this.inspections = ins.filter(i => i.projectId === this.projectId);
        });

        // Fetch AI safety alerts for this project
        this.safetyViolationService.getSafetyViolations().subscribe(alerts => {
          this.safetyAlerts = alerts.filter(a => a.projectId === this.projectId);
          this.isLoading = false;
        });
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/projects']);
      }
    });
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'active': return 'status-active';
      case 'planning': return 'status-planning';
      case 'delayed': return 'status-delayed';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  getStatusLabel(status?: string): string {
    if (!status) return '';
    switch (status) {
      case 'active': return 'Active Site';
      case 'planning': return 'Planning Phase';
      case 'delayed': return 'Delayed';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  getBadgeClass(val: string): string {
    const v = val ? val.toLowerCase() : '';
    if (v.includes('pass') || v.includes('resolved') || v.includes('active')) return 'badge-success';
    if (v.includes('fail') || v.includes('critical') || v.includes('open')) return 'badge-danger';
    return 'badge-warning';
  }
}
