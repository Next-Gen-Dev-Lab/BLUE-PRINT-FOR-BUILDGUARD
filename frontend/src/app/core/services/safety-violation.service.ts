import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { SafetyAlert } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SafetyViolationService {
  private readonly violationsSubject = new BehaviorSubject<SafetyAlert[]>([]);
  public violations$ = this.violationsSubject.asObservable();

  constructor(private readonly api: BaseApiService) {}

  private mapResponseToSafetyAlert(res: any): SafetyAlert {
    let mappedSeverity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    const sevLower = (res.severity || '').toLowerCase();
    if (sevLower === 'low') mappedSeverity = 'low';
    else if (sevLower === 'high') mappedSeverity = 'high';
    else if (sevLower === 'critical') mappedSeverity = 'critical';

    let mappedStatus: 'open' | 'resolved' | 'investigating' = 'open';
    const statLower = (res.status || '').toLowerCase();
    if (statLower === 'resolved') mappedStatus = 'resolved';
    else if (statLower === 'investigating') mappedStatus = 'investigating';

    let mappedCategory: 'PPE' | 'Scaffolding' | 'Electrical' | 'Fall Hazard' | 'General' = 'General';
    const typeLower = (res.violationType || '').toLowerCase();
    if (typeLower.includes('ppe') || typeLower.includes('head') || typeLower.includes('helmet')) mappedCategory = 'PPE';
    else if (typeLower.includes('scaffold')) mappedCategory = 'Scaffolding';
    else if (typeLower.includes('electric')) mappedCategory = 'Electrical';
    else if (typeLower.includes('fall') || typeLower.includes('perimeter')) mappedCategory = 'Fall Hazard';

    return {
      id: String(res.id || ''),
      projectId: 'p1',
      projectName: 'Downtown Skyscraper Tower A',
      title: res.description || 'Safety Violation Alert',
      description: res.description || '',
      severity: mappedSeverity,
      riskLevel: mappedSeverity === 'critical' ? 'Immediate Threat (Class A)' : 'Standard Hazard (Class C)',
      suggestedActions: ['Inspect site guidelines', 'Conduct safety review'],
      comments: [],
      status: mappedStatus,
      timestamp: res.createdAt || '',
      category: mappedCategory
    };
  }

  private mapSafetyAlertToRequest(alert: Partial<SafetyAlert>): any {
    return {
      violationType: alert.category || 'General',
      description: alert.title || alert.description || '',
      severity: (alert.severity || 'MEDIUM').toUpperCase(),
      status: (alert.status || 'OPEN').toUpperCase(),
      inspectionId: 1
    };
  }

  getSafetyViolations(): Observable<SafetyAlert[]> {
    return this.api.getList<SafetyAlert>('safety-violations', v => this.mapResponseToSafetyAlert(v)).pipe(
      tap(v => this.violationsSubject.next(v))
    );
  }

  createSafetyViolation(violation: Partial<SafetyAlert>): Observable<SafetyAlert> {
    const payload = this.mapSafetyAlertToRequest(violation);
    return this.api.post<SafetyAlert>('safety-violations', payload, res => this.mapResponseToSafetyAlert(res)).pipe(
      switchMap(newViolation => this.getSafetyViolations().pipe(
        map(() => newViolation)
      ))
    );
  }
}
