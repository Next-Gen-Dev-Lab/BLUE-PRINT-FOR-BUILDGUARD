import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Blueprint } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlueprintService {
  constructor(private readonly api: BaseApiService) {}

  private mapResponseToBlueprint(res: any): Blueprint {
    return {
      id: String(res.id || ''),
      projectId: String(res.projectId || ''),
      name: res.blueprintName || res.fileName || 'Blueprint Document',
      version: 'v1.0',
      lastUpdated: res.uploadedAt ? res.uploadedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      comments: [],
      versionHistory: []
    };
  }

  getBlueprints(): Observable<Blueprint[]> {
    return this.api.getList<Blueprint>('blueprints', b => this.mapResponseToBlueprint(b));
  }

  uploadBlueprint(payload: FormData): Observable<Blueprint> {
    return this.api.post<Blueprint>('blueprints/upload', payload, res => this.mapResponseToBlueprint(res));
  }
}
