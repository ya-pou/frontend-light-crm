import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG_TOKEN, AppConfig } from '../config/app-config.token';
import { Observable } from 'rxjs';

export interface CustomerListItem {
  id: number;
  name: string;
  lastName: string;
  email: string;
  telephone: string;
  sector: string;
  status: string;
  user?: {
    id: number;
    name: string;
    lastName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject(APP_CONFIG_TOKEN) private config: AppConfig) {
    this.baseUrl = `${this.config.apiBaseUrl}/customers`;
  }

  getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    dir?: string;
  }): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl, { params });
  }

  findOne(id: number): Observable<CustomerListItem> {
    return this.httpClient.get<CustomerListItem>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: any): Observable<CustomerListItem> {
    return this.httpClient.patch<CustomerListItem>(`${this.baseUrl}/${id}`, payload);
  }

  create(payload: any): Observable<CustomerListItem> {
    return this.httpClient.post<CustomerListItem>(this.baseUrl, payload);
  }
}
