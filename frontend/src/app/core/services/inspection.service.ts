import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { Inspection } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  
  private readonly inspectionsSubject = new BehaviorSubject<Inspection[]>([]);
  public inspections$ = this.inspectionsSubject.asObservable();

  constructor(private readonly api: BaseApiService) {}

  private mapResponseToInspection(res: any): Inspection {
    let mappedStatus: 'scheduled' | 'passed' | 'failed' | 'pending_review' = 'scheduled';
    const statusLower = (res.status || '').toLowerCase();
    if (statusLower === 'passed') mappedStatus = 'passed';
    else if (statusLower === 'failed') mappedStatus = 'failed';
    else if (statusLower === 'pending_review' || statusLower === 'pending') mappedStatus = 'pending_review';

    let score = 0;
    if (statusLower === 'passed') {
      score = 100;
    } else if (statusLower === 'failed') {
      score = 50;
    }

    return {
      id: String(res.id || ''),
      projectId: String(res.progressLogId || 'p1'),
      projectName: 'Downtown Skyscraper Tower A',
      type: 'Structural Safety & Framing',
      date: res.inspectionDate || '',
      status: mappedStatus,
      assignedInspector: 'Ellen Ripley',
      checklist: [
        { id: 'cl1_1', item: 'Anchor bolts tension check', status: 'passed' },
        { id: 'cl1_2', item: 'Columns verticality alignment', status: 'passed' }
      ],
      score,
      notes: res.remarks || ''
    };
  }

  private mapInspectionToRequest(insp: Partial<Inspection>): any {
    return {
      inspectionDate: insp.date,
      status: (insp.status || 'SCHEDULED').toUpperCase(),
      remarks: insp.notes || '',
      inspectorId: 1,
      progressLogId: Number(insp.projectId) || 1
    };
  }

  getInspections(): Observable<Inspection[]> {
    return this.api.getList<Inspection>('inspections', i => this.mapResponseToInspection(i)).pipe(
      tap(insps => this.inspectionsSubject.next(insps))
    );
  }

  createInspection(inspection: Partial<Inspection>): Observable<Inspection> {
    const payload = this.mapInspectionToRequest(inspection);
    return this.api.post<Inspection>('inspections', payload, res => this.mapResponseToInspection(res)).pipe(
      switchMap(newInsp => this.getInspections().pipe(
        map(() => newInsp)
      ))
    );
  }
}
