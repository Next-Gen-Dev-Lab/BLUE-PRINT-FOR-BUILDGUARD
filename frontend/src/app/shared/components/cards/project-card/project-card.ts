import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../core/models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.css']
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() viewDetails = new EventEmitter<string>();

  onViewDetails(): void {
    this.viewDetails.emit(this.project.id);
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
      case 'active': return 'Active Site';
      case 'planning': return 'Planning Phase';
      case 'delayed': return 'Delayed';
      case 'completed': return 'Completed';
      default: return status;
    }
  }
}
