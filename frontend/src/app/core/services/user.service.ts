import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User } from '../models';
import { mapApiUserToUser, mapUserToApiRequest } from '../utils/user-mappers';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly api: BaseApiService) {}

  getUsers(): Observable<User[]> {
    return this.api.getList<User>('users', mapApiUserToUser);
  }

  saveUser(user: User): Observable<User> {
    const payload = mapUserToApiRequest(user);
    return this.api.post<User>('users', payload, mapApiUserToUser);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`users/${id}`);
  }
}
