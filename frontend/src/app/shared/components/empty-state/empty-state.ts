import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.css']
})
export class EmptyStateComponent {
  @Input() title: string = 'No results found';
  @Input() description: string = 'Try adjusting your search query or filters to find what you are looking for.';
  @Input() iconType: 'search' | 'blueprint' | 'inspection' | 'alert' | 'log' = 'search';
  @Input() actionText: string = '';

  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
