import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { SystemNotification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<SystemNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private readonly api: BaseApiService) {}

  private mapResponseToNotification(res: any): SystemNotification {
    let mappedType: 'safety' | 'project' | 'inspection' | 'approval' = 'project';
    const typeLower = (res.type || '').toLowerCase();
    if (typeLower === 'safety') mappedType = 'safety';
    else if (typeLower === 'inspection') mappedType = 'inspection';
    else if (typeLower === 'approval') mappedType = 'approval';

    let relatedLink = '/projects';
    if (mappedType === 'safety') {
      relatedLink = '/safety';
    } else if (mappedType === 'inspection') {
      relatedLink = '/inspections';
    }

    return {
      id: String(res.id || ''),
      title: res.title || '',
      type: mappedType,
      content: res.message || '',
      isRead: !!res.isRead,
      timestamp: res.createdAt || '',
      relatedLink
    };
  }

  getNotifications(): Observable<SystemNotification[]> {
    return this.api.getList<SystemNotification>('notifications', n => this.mapResponseToNotification(n)).pipe(
      tap(n => this.notificationsSubject.next(n))
    );
  }

  markNotificationAsRead(id: string): Observable<any> {
    return this.api.put<any>(`notifications/${id}/read`, {}).pipe(
      switchMap(res => this.getNotifications().pipe(
        map(() => res)
      ))
    );
  }

  markAllAsRead(): Observable<any> {
    return this.api.put<any>('notifications/read-all', {}).pipe(
      switchMap(res => this.getNotifications().pipe(
        map(() => res)
      ))
    );
  }

  clearNotifications(): Observable<any> {
    return this.api.delete('notifications').pipe(
      tap(() => this.notificationsSubject.next([]))
    );
  }
}
