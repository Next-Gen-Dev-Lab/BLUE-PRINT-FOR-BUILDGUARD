import { Pipe, PipeTransform } from '@angular/core';
import { SafetyAlert } from '../../core/models';

@Pipe({
  name: 'filterResolvedAlerts',
  standalone: true
})
export class FilterResolvedAlertsPipe implements PipeTransform {
  transform(alerts: SafetyAlert[]): SafetyAlert[] {
    if (!alerts) return [];
    return alerts.filter(a => a.status === 'resolved');
  }
}
