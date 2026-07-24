import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private toastCounter = 0;

  public show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000): void {
    const id = 'toast_' + Date.now() + '_' + (++this.toastCounter);
    const newToast: ToastMessage = { id, message, type, duration };
    
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  public success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  public error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  public warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  public info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  public remove(id: string): void {
    const updated = this.toastsSubject.value.filter(t => t.id !== id);
    this.toastsSubject.next(updated);
  }
}
