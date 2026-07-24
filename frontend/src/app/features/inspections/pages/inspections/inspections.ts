import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project.service';
import { InspectionService } from '../../../../core/services/inspection.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Project, Inspection } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { FilterScheduledPipe } from '../../../../shared/pipes/filter-scheduled.pipe';
import { FilterHistoryPipe } from '../../../../shared/pipes/filter-history.pipe';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, FilterScheduledPipe, FilterHistoryPipe],
  templateUrl: './inspections.html',
  styleUrls: ['./inspections.css']
})
export class InspectionsComponent implements OnInit {
  projects: Project[] = [];
  inspections: Inspection[] = [];
  filteredInspections: Inspection[] = [];
  
  isLoading = true;
  isSubmitting = false;

  // Search/Filter state
  searchQuery = '';
  statusFilter = '';

  // Active Inspection overlay checklist state
  selectedInspection: Inspection | null = null;
  checklistEditMode = false;
  auditNotes = '';

  // Schedule New Inspection state
  isScheduling = false;
  scheduleProjectId = '';
  scheduleType = '';
  scheduleDate = new Date().toISOString().split('T')[0];
  scheduleInspector = 'Ellen Ripley';

  constructor(
    private readonly projectService: ProjectService,
    private readonly inspectionService: InspectionService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load projects
    this.projectService.getProjects().subscribe(projs => this.projects = projs);

    // Load inspections
    this.inspectionService.getInspections().subscribe({
      next: (ins) => {
        this.inspections = ins;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.inspections];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i => 
        i.projectName.toLowerCase().includes(q) || 
        i.type.toLowerCase().includes(q) || 
        i.assignedInspector.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter) {
      result = result.filter(i => i.status === this.statusFilter);
    }

    this.filteredInspections = result;
  }

  // --- Active audit modal operations ---
  viewInspection(ins: Inspection): void {
    this.selectedInspection = { ...ins, checklist: ins.checklist.map(c => ({ ...c })) };
    this.auditNotes = ins.notes || '';
    this.checklistEditMode = ins.status === 'scheduled' || ins.status === 'pending_review';
  }

  closeInspectionModal(): void {
    this.selectedInspection = null;
    this.checklistEditMode = false;
  }

  updateChecklistItemStatus(itemId: string, status: 'passed' | 'failed' | 'n/a'): void {
    if (!this.selectedInspection || !this.checklistEditMode) return;
    
    const item = this.selectedInspection.checklist.find(c => c.id === itemId);
    if (item) {
      item.status = status;
    }
  }

  updateChecklistItemComment(itemId: string, comment: string): void {
    if (!this.selectedInspection || !this.checklistEditMode) return;

    const item = this.selectedInspection.checklist.find(c => c.id === itemId);
    if (item) {
      item.comments = comment;
    }
  }

  submitInspectionResults(): void {
    if (!this.selectedInspection) return;

    // Verify all checklist items have a chosen status (not n/a unless intended, but must not be unset)
    const checklist = this.selectedInspection.checklist;
    
    // Calculate compliance rating percentage
    // Formulas: passed items / total evaluated items (passed + failed) * 100
    const evaluated = checklist.filter(c => c.status === 'passed' || c.status === 'failed');
    const passed = checklist.filter(c => c.status === 'passed');
    
    const score = evaluated.length > 0 ? Math.round((passed.length / evaluated.length) * 100) : 100;

    this.isSubmitting = true;
    
    if (!this.selectedInspection) return;

    const updatedInspection: Inspection = {
      ...this.selectedInspection,
      checklist: checklist,
      score: score,
      notes: this.auditNotes,
      status: score >= 80 ? 'passed' : 'failed'
    };

    this.inspectionService.createInspection(updatedInspection).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success(`Inspection audit submitted. Score computed: ${score}%`);
        this.loadData();
        this.closeInspectionModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error compiling audit.');
      }
    });
  }

  // --- Schedule inspection operations ---
  toggleScheduleForm(): void {
    this.isScheduling = !this.isScheduling;
    this.scheduleProjectId = '';
    this.scheduleType = '';
    this.scheduleDate = new Date().toISOString().split('T')[0];
  }

  submitSchedule(): void {
    if (!this.scheduleProjectId || !this.scheduleType.trim() || !this.scheduleDate) {
      this.toast.warning('Please input all scheduling fields.');
      return;
    }

    const selectedProj = this.projects.find(p => p.id === this.scheduleProjectId);
    if (!selectedProj) return;

    this.isSubmitting = true;
    
    const payload: Inspection = {
      id: '',
      projectId: this.scheduleProjectId,
      projectName: selectedProj.name,
      type: this.scheduleType,
      date: this.scheduleDate,
      assignedInspector: this.scheduleInspector,
      checklist: [],
      score: 0,
      status: 'scheduled'
    };

    this.inspectionService.createInspection(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success('Inspection audit scheduled successfully.');
        this.loadData();
        this.toggleScheduleForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error scheduling audit.');
      }
    });
  }

  getBadgeClass(val: string): string {
    const v = val ? val.toLowerCase() : '';
    if (v.includes('pass')) return 'badge-success';
    if (v.includes('fail')) return 'badge-danger';
    if (v.includes('schedule')) return 'badge-info';
    return 'badge-warning';
  }
}
