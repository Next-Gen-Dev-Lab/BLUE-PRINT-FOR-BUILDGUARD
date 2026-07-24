import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { BlueprintService } from '../../../../core/services/blueprint.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Project, Blueprint, BlueprintComment } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-blueprint-center',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './blueprints.html',
  styleUrls: ['./blueprints.css']
})
export class BlueprintCenterComponent implements OnInit {
  protected readonly Math = Math;
  projects: Project[] = [];
  blueprints: Blueprint[] = [];
  selectedProjectId: string = '';
  selectedBlueprint: Blueprint | null = null;
  
  isLoadingProjects = true;
  isLoadingBlueprints = false;

  // Viewport transforms (for blueprint document mock zoom & pan)
  zoomScale = 1.0;
  rotateDegrees = 0;
  isPanning = false;
  panStart = { x: 0, y: 0 };
  panOffset = { x: 0, y: 0 };

  // Comments and Version states
  newCommentText = '';
  isAddingVersion = false;
  newVersionStr = '';
  newVersionChangeLog = '';

  constructor(
    private readonly projectService: ProjectService,
    private readonly blueprintService: BlueprintService,
    private readonly toast: ToastService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projs) => {
        this.projects = projs;
        this.isLoadingProjects = false;
        
        // Handle route pre-selection
        this.route.queryParams.subscribe(params => {
          const bpId = params['blueprintId'];
          if (bpId) {
            this.loadBlueprintDirectly(bpId);
          } else if (projs.length > 0) {
            this.selectedProjectId = projs[0].id;
            this.loadBlueprintsForProject(this.selectedProjectId);
          }
        });
      },
      error: () => {
        this.isLoadingProjects = false;
      }
    });
  }

  loadBlueprintDirectly(blueprintId: string): void {
    this.isLoadingBlueprints = true;
    
    this.blueprintService.getBlueprints().subscribe(allBps => {
      const targetBp = allBps.find(b => b.id === blueprintId);
      if (targetBp) {
        this.selectedProjectId = targetBp.projectId;
        this.selectedBlueprint = targetBp;
        this.blueprints = allBps.filter(b => b.projectId === this.selectedProjectId);
      }
      this.isLoadingBlueprints = false;
    });
  }

  onProjectChange(): void {
    this.selectedBlueprint = null;
    this.loadBlueprintsForProject(this.selectedProjectId);
  }

  loadBlueprintsForProject(projectId: string): void {
    this.isLoadingBlueprints = true;
    this.blueprintService.getBlueprints().subscribe(bps => {
      const filtered = bps.filter(b => b.projectId === projectId);
      this.blueprints = filtered;
      if (filtered.length > 0) {
        this.selectedBlueprint = filtered[0];
      }
      this.resetViewport();
      this.isLoadingBlueprints = false;
    });
  }

  selectBlueprint(bp: Blueprint): void {
    this.selectedBlueprint = bp;
    this.resetViewport();
  }

  // --- Viewport controls ---
  zoomIn(): void {
    this.zoomScale = Math.min(2.5, this.zoomScale + 0.15);
  }

  zoomOut(): void {
    this.zoomScale = Math.max(0.5, this.zoomScale - 0.15);
  }

  rotateClockwise(): void {
    this.rotateDegrees = (this.rotateDegrees + 90) % 360;
  }

  rotateCounter(): void {
    this.rotateDegrees = (this.rotateDegrees - 90 + 360) % 360;
  }

  resetViewport(): void {
    this.zoomScale = 1.0;
    this.rotateDegrees = 0;
    this.panOffset = { x: 0, y: 0 };
  }

  // Pan controls
  startPan(event: MouseEvent): void {
    event.preventDefault();
    this.isPanning = true;
    this.panStart = {
      x: event.clientX - this.panOffset.x,
      y: event.clientY - this.panOffset.y
    };
  }

  pan(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panOffset = {
      x: event.clientX - this.panStart.x,
      y: event.clientY - this.panStart.y
    };
  }

  stopPan(): void {
    this.isPanning = false;
  }

  addComment(): void {
    if (!this.selectedBlueprint || !this.newCommentText.trim()) return;

    const newComment: BlueprintComment = {
      id: 'c_' + Date.now(),
      author: 'CurrentUser',
      role: 'Safety Admin',
      text: this.newCommentText,
      timestamp: new Date().toISOString()
    };
    this.selectedBlueprint.comments.unshift(newComment);
    this.newCommentText = '';
    this.toast.success('Blueprint markup comment posted.');
  }

  // --- Versioning Management ---
  toggleAddVersion(): void {
    this.isAddingVersion = !this.isAddingVersion;
    this.newVersionStr = '';
    this.newVersionChangeLog = '';
  }

  submitNewVersion(): void {
    if (!this.selectedBlueprint || !this.newVersionStr.trim() || !this.newVersionChangeLog.trim()) {
      this.toast.warning('Please input both version number and changelog.');
      return;
    }

    const formData = new FormData();
    formData.append('projectId', this.selectedProjectId);
    formData.append('blueprintId', this.selectedBlueprint.id);
    formData.append('version', this.newVersionStr);
    formData.append('changelog', this.newVersionChangeLog);

    this.blueprintService.uploadBlueprint(formData).subscribe({
      next: () => {
        this.toast.success(`Uploaded new blueprint version: ${this.newVersionStr}`);
        this.loadBlueprintsForProject(this.selectedProjectId);
        this.isAddingVersion = false;
      },
      error: () => {
        // Fallback simulation
        const newVer = {
          version: this.newVersionStr,
          date: new Date().toISOString().split('T')[0],
          author: 'CurrentUser',
          changeLog: this.newVersionChangeLog
        };
        this.selectedBlueprint?.versionHistory.unshift(newVer);
        if (this.selectedBlueprint) {
          this.selectedBlueprint.version = this.newVersionStr;
        }
        this.isAddingVersion = false;
        this.toast.success(`Uploaded new blueprint version: ${this.newVersionStr}`);
      }
    });
  }

  mockDownload(): void {
    if (!this.selectedBlueprint) return;
    this.toast.success(`Mocking PDF download: ${this.selectedBlueprint.name}`);
  }
}
