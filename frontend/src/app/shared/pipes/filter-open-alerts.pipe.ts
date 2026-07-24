import { Pipe, PipeTransform } from '@angular/core';
import { SafetyAlert } from '../../core/models';

@Pipe({
  name: 'filterOpenAlerts',
  standalone: true
})
export class FilterOpenAlertsPipe implements PipeTransform {
  transform(alerts: SafetyAlert[]): SafetyAlert[] {
    if (!alerts) return [];
    return alerts.filter(a => a.status === 'open' || a.status === 'investigating');
  }
}
