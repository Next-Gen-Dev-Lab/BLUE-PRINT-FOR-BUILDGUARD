import { Pipe, PipeTransform } from '@angular/core';
import { Inspection } from '../../core/models';

@Pipe({
  name: 'filterScheduled',
  standalone: true
})
export class FilterScheduledPipe implements PipeTransform {
  transform(inspections: Inspection[]): Inspection[] {
    if (!inspections) return [];
    return inspections.filter(i => i.status === 'scheduled' || i.status === 'pending_review');
  }
}
