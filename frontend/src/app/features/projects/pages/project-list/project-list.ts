import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../core/models';
import { ProjectCardComponent } from '../../../../shared/components/cards/project-card/project-card';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = true;

  // View States
  viewMode: 'grid' | 'list' = 'grid';

  // Search & Filter state
  searchQuery: string = '';
  statusFilter: string = '';
  sortBy: string = 'name';

  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projs) => {
        this.projects = projs;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onViewDetails(id: string): void {
    this.router.navigate(['/projects', id]);
  }

  applyFilters(): void {
    let result = [...this.projects];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) || 
        p.assignedEngineer.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (this.statusFilter) {
      result = result.filter(p => p.status === this.statusFilter);
    }

    // Sort order
    result.sort((a, b) => {
      if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.sortBy === 'progress') {
        return b.progress - a.progress; // descending progress
      } else if (this.sortBy === 'compliance') {
        return b.complianceScore - a.complianceScore; // descending compliance score
      }
      return 0;
    });

    this.filteredProjects = result;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'planning': return 'status-planning';
      case 'delayed': return 'status-delayed';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'planning': return 'Planning';
      case 'delayed': return 'Delayed';
      case 'completed': return 'Completed';
      default: return status;
    }
  }
}
