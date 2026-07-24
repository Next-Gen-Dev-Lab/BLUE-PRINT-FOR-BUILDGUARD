import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { DailyLog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProgressLogService {
  constructor(private readonly api: BaseApiService) {}

  private mapResponseToDailyLog(res: any): DailyLog {
    return {
      id: String(res.id || ''),
      projectId: String(res.projectId || ''),
      projectName: 'Downtown Skyscraper Tower A',
      date: res.workDate || '',
      location: 'Floor 42',
      workDescription: res.description || '',
      materialUsed: 'Standard Construction Material',
      workersCount: 20,
      weather: 'Sunny - 75°F',
      status: (res.workStatus || 'submitted').toLowerCase() === 'submitted' ? 'submitted' : 'draft',
      imageMockups: res.imageUrl ? [res.imageUrl] : []
    };
  }

  getProgressLogs(): Observable<DailyLog[]> {
    return this.api.getList<DailyLog>('progress-logs', p => this.mapResponseToDailyLog(p));
  }

  createProgressLog(payload: DailyLog | FormData): Observable<DailyLog> {
    let finalPayload: FormData;
    
    if (payload instanceof FormData) {
      finalPayload = new FormData();
      const description = payload.get('workDescription') as string || payload.get('description') as string || '';
      const workDate = payload.get('date') as string || payload.get('workDate') as string || '';
      const workStatus = (payload.get('status') as string || payload.get('workStatus') as string || 'submitted').toUpperCase();
      const projectId = payload.get('projectId') as string || '1';
      const imageFile = payload.get('images') || payload.get('image');

      finalPayload.append('description', description);
      finalPayload.append('workDate', workDate);
      finalPayload.append('workStatus', workStatus);
      finalPayload.append('projectId', projectId);
      finalPayload.append('userId', '1');
      finalPayload.append('uploadedBy', '1');
      
      if (imageFile) {
        finalPayload.append('image', imageFile);
      } else {
        const dummyBlob = new Blob([''], { type: 'image/png' });
        finalPayload.append('image', dummyBlob, 'empty.png');
      }
    } else {
      finalPayload = new FormData();
      finalPayload.append('description', payload.workDescription || '');
      finalPayload.append('workDate', payload.date || '');
      finalPayload.append('workStatus', (payload.status || 'submitted').toUpperCase());
      finalPayload.append('projectId', payload.projectId || '1');
      finalPayload.append('userId', '1');
      finalPayload.append('uploadedBy', '1');
      
      const dummyBlob = new Blob([''], { type: 'image/png' });
      finalPayload.append('image', dummyBlob, 'empty.png');
    }

    return this.api.post<DailyLog>('progress-logs/upload', finalPayload, res => this.mapResponseToDailyLog(res));
  }
}
