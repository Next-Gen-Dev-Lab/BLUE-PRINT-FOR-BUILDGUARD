import { Pipe, PipeTransform } from '@angular/core';
import { Inspection } from '../../core/models';

@Pipe({
  name: 'filterHistory',
  standalone: true
})
export class FilterHistoryPipe implements PipeTransform {
  transform(inspections: Inspection[]): Inspection[] {
    if (!inspections) return [];
    return inspections.filter(i => i.status === 'passed' || i.status === 'failed');
  }
}
