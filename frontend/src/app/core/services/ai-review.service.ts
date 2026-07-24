import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiReviewService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  analyze(prompt: string, projectId: string, inspectionId?: string): Observable<any> {
    const payload = { prompt, projectId, inspectionId };
    return this.http.post<any>(`${this.apiUrl}/ai/analyze`, payload);
  }
}
