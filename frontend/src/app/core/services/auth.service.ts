import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, switchMap, delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models';
import { mapApiUserToUser, mapRegistrationFormToApiRequest } from '../utils/user-mappers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private lastRegisteredUser: User | null = null;

  constructor(private readonly http: HttpClient) {
    const savedUser = localStorage.getItem('bg_current_user');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        this.logout();
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string; email: string; role: string }>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('bg_jwt_token', res.token);
        }
      }),
      switchMap(() => this.getProfile())
    );
  }

  register(userData: any): Observable<any> {
    const payload = mapRegistrationFormToApiRequest(userData);
    return this.http.post(`${this.apiUrl}/auth/register`, payload, { responseType: 'text' }).pipe(
      tap(() => {
        this.lastRegisteredUser = mapApiUserToUser({
          id: 0,
          fullName: payload.fullName,
          email: payload.email,
          role: payload.role,
          phone: payload.phone
        });
      })
    );
  }

  getPendingApprovalUser(): User | null {
    return this.lastRegisteredUser;
  }

  getProfile(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      map(res => mapApiUserToUser(res)),
      tap(user => {
        localStorage.setItem('bg_current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  updateProfile(profileData: { name: string; phone: string }): Observable<User> {
    const updated = { ...this.currentUserValue, ...profileData } as User;
    localStorage.setItem('bg_current_user', JSON.stringify(updated));
    this.currentUserSubject.next(updated);
    return of(updated).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('bg_jwt_token');
    localStorage.removeItem('bg_current_user');
    this.currentUserSubject.next(null);
  }

  requestPasswordReset(email: string): Observable<string> {
    return of('Password reset instructions have been dispatched to your email address.').pipe(delay(800));
  }
}
