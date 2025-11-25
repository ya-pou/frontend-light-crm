import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NgClass } from '@angular/common';
import {
  ArrowLeftFromLine,
  HandshakeIcon,
  LogOut,
  LucideAngularModule,
  TrendingUpIcon,
  UserIcon,
  ArrowRightFromLine,
  MenuIcon,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, NgClass],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  // ICONS
  readonly UserIcon = UserIcon;
  readonly HandshakeIcon = HandshakeIcon;
  readonly TrendingUpIcon = TrendingUpIcon;
  readonly LogOut = LogOut;
  readonly ArrowLeftFromLine = ArrowLeftFromLine;
  readonly ArrowRightFromLine = ArrowRightFromLine;
  readonly MenuIcon = MenuIcon;

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
