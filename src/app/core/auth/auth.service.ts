import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { APP_CONFIG_TOKEN, AppConfig } from '../config/app-config.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<any | null>(null);

  constructor(private http: HttpClient, @Inject(APP_CONFIG_TOKEN) private config: AppConfig) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser.set(payload);
    } catch (error) {
      throw new Error(`Error when load user from the storage`);
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.config.apiBaseUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);

        const payload = JSON.parse(atob(res.access_token.split('.')[1]));
        this.currentUser.set(payload);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  isLogged() {
    return !!this.currentUser();
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
