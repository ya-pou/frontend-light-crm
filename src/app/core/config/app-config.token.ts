import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiBaseUrl: string;
  production: boolean;
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('app.config');
