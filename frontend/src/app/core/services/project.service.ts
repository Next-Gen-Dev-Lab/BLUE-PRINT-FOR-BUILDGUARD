import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { Project } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private readonly api: BaseApiService) {}

  private mapResponseToProject(res: any): Project {
    let mappedStatus: 'planning' | 'active' | 'delayed' | 'completed' = 'active';
    const statusLower = (res.status || '').toLowerCase();
    if (statusLower === 'planning') mappedStatus = 'planning';
    else if (statusLower === 'delayed') mappedStatus = 'delayed';
    else if (statusLower === 'completed') mappedStatus = 'completed';

    return {
      id: String(res.id || ''),
      name: res.projectName || '',
      location: res.location || '',
      progress: statusLower === 'completed' ? 100 : 50,
      status: mappedStatus,
      assignedEngineer: res.clientName || 'Unassigned',
      startDate: res.startDate || '',
      endDate: res.endDate || '',
      description: 'Project details and structural review.',
      complianceScore: 85,
      recentUpdates: ['Project synced with backend services.'],
      documentCount: 0,
      inspectionCount: 0
    };
  }

  private mapProjectToRequest(proj: Partial<Project>): any {
    return {
      projectName: proj.name,
      location: proj.location,
      clientName: proj.assignedEngineer || 'Unassigned',
      startDate: proj.startDate,
      endDate: proj.endDate,
      status: (proj.status || 'ACTIVE').toUpperCase()
    };
  }

  getProjects(): Observable<Project[]> {
    return this.api.getList<Project>('projects', p => this.mapResponseToProject(p)).pipe(
      tap(projs => this.projectsSubject.next(projs))
    );
  }

  getProjectById(id: string): Observable<Project> {
    return this.api.getOne<Project>(`projects/${id}`, res => this.mapResponseToProject(res));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const payload = this.mapProjectToRequest(project);
    return this.api.post<Project>('projects', payload, res => this.mapResponseToProject(res)).pipe(
      switchMap(newProj => this.getProjects().pipe(
        map(() => newProj)
      ))
    );
  }
}
