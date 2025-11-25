import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG_TOKEN, AppConfig } from '../config/app-config.token';
import { Observable } from 'rxjs';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface UserListItem {
  id: number;
  name: string;
  lastName: string;
  profil: UserRole;
  actif: boolean;
  manager?: {
    id: number;
    name: string;
    lastName: string;
  } | null;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject(APP_CONFIG_TOKEN) private config: AppConfig) {
    this.baseUrl = `${this.config.apiBaseUrl}/users`;
  }

  getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    dir?: string;
  }): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}`, { params });
  }

  findOne(id: number): Observable<UserListItem> {
    return this.httpClient.get<UserListItem>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: any): Observable<UserListItem> {
    return this.httpClient.patch<UserListItem>(`${this.baseUrl}/${id}`, payload);
  }

  create(payload: any): Observable<UserListItem> {
    return this.httpClient.post<UserListItem>(this.baseUrl, payload);
  }

  findManagers() {
    return this.httpClient.get<UserListItem[]>(`${this.baseUrl}?profil=manager`);
  }
}
