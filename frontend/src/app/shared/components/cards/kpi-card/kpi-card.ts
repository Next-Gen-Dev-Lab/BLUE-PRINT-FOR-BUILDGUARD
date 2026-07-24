import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrls: ['./kpi-card.css']
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '0';
  @Input() subtitle: string = '';
  @Input() iconType: 'project' | 'site' | 'completed' | 'inspection_pending' | 'inspection_done' | 'alert' | 'violation' | 'compliance' | 'workers' = 'project';
  @Input() trend: string = '';
  @Input() trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() cardTheme: 'blue' | 'orange' | 'green' | 'red' | 'gray' = 'blue';
}
