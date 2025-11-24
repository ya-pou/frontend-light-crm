import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  // Desktop : sidebar réduite ou non
  sidebarCollapsed = false;

  // Mobile : sidebar ouverte ou non (overlay)
  mobileSidebarOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  toggleDesktopSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openMobileSidebar() {
    this.mobileSidebarOpen = true;
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get userEmail(): string {
    return this.auth.currentUser()?.email ?? '';
  }
}
