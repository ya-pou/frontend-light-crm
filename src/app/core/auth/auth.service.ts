import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:3000/auth';

  currentUser = signal<any | null>(null);

  constructor(private http: HttpClient) {
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
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res) => {
        console.log(res);
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
