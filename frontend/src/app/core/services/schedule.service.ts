import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { Schedule } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly schedulesSubject = new BehaviorSubject<Schedule[]>([]);
  public schedules$ = this.schedulesSubject.asObservable();

  constructor(private readonly api: BaseApiService) {}

  private mapResponseToSchedule(res: any): Schedule {
    let mappedStatus: 'scheduled' | 'completed' | 'cancelled' = 'scheduled';
    const statusLower = (res.status || '').toLowerCase();
    if (statusLower === 'completed') mappedStatus = 'completed';
    else if (statusLower === 'cancelled') mappedStatus = 'cancelled';

    return {
      id: String(res.id || ''),
      projectId: String(res.projectId || '1'),
      projectName: 'Downtown Skyscraper Tower A',
      title: res.taskName || '',
      date: res.startDate || '',
      time: '09:00',
      type: 'inspection',
      assignedTo: 'Ellen Ripley',
      status: mappedStatus
    };
  }

  private mapScheduleToRequest(sch: Partial<Schedule>): any {
    return {
      taskName: sch.title || '',
      description: sch.title || 'Scheduled task',
      startDate: sch.date,
      endDate: sch.date,
      status: (sch.status || 'SCHEDULED').toUpperCase(),
      projectId: Number(sch.projectId) || 1
    };
  }

  getSchedules(): Observable<Schedule[]> {
    return this.api.getList<Schedule>('schedules', s => this.mapResponseToSchedule(s)).pipe(
      tap(s => this.schedulesSubject.next(s))
    );
  }

  saveSchedule(schedule: Partial<Schedule>): Observable<Schedule> {
    const payload = this.mapScheduleToRequest(schedule);
    return this.api.post<Schedule>('schedules', payload, res => this.mapResponseToSchedule(res)).pipe(
      switchMap(newSchedule => this.getSchedules().pipe(
        map(() => newSchedule)
      ))
    );
  }

  deleteSchedule(id: string): Observable<any> {
    return this.api.delete(`schedules/${id}`).pipe(
      switchMap(res => this.getSchedules().pipe(
        map(() => res)
      ))
    );
  }
}
