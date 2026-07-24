import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getList<T>(path: string, mapper?: (r: any) => T): Observable<T[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${path}`).pipe(
      map(arr => (arr || []).map(item => (mapper ? mapper(item) : (item as unknown as T))))
    );
  }

  getOne<T>(path: string, mapper?: (r: any) => T): Observable<T> {
    return this.http.get<any>(`${this.apiUrl}/${path}`).pipe(
      map(res => (mapper ? mapper(res) : (res as unknown as T)))
    );
  }

  post<T>(path: string, payload: any, mapper?: (r: any) => T): Observable<T> {
    return this.http.post<any>(`${this.apiUrl}/${path}`, payload).pipe(
      map(res => (mapper ? mapper(res) : (res as unknown as T)))
    );
  }

  delete(path: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${path}`);
  }

  put<T>(path: string, payload: any, mapper?: (r: any) => T): Observable<T> {
    return this.http.put<any>(`${this.apiUrl}/${path}`, payload).pipe(
      map(res => (mapper ? mapper(res) : (res as unknown as T)))
    );
  }
}
