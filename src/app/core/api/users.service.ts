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
  telephone?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject(APP_CONFIG_TOKEN) private config: AppConfig) {
    this.baseUrl = `${this.config.apiBaseUrl}/users`;
  }

  findAll(): Observable<UserListItem[]> {
    return this.httpClient.get<UserListItem[]>(this.baseUrl);
  }
}
