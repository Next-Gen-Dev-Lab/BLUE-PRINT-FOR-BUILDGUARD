import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  sendEmail(recipient: string, subject: string, message: string): Observable<any> {
    const payload = { recipient, subject, message };
    return this.http.post<any>(`${this.apiUrl}/email/send`, payload);
  }
}
