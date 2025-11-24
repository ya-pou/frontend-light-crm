import { Component, OnInit, signal } from '@angular/core';
import { UserListItem, UserRole, UsersService } from '../../core/api/users.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [],
  templateUrl: `./users.component.html`,
})
export class UsersComponent implements OnInit {
  users = signal<UserListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  search = signal<string>('');

  readonly UserRole = UserRole;

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.findAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les utilisateurs');
        this.loading.set(false);
      },
    });
  }

  get filteredUsers(): UserListItem[] {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.users();
    return this.users().filter((u) =>
      `${u.name} ${u.lastName} ${u.email}`.toLowerCase().includes(term)
    );
  }

  roleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.MANAGER:
        return 'Manager';
      default:
        return 'Utilisateur';
    }
  }

  onNewUserClick() {
    this.router.navigate([`users`, `new`]);
  }

  // placeholder pour le futur CRUD admin
  onEdit(userId: number) {
    console.log(userId);
    this.router.navigate([`users`, `${userId.toString()}`]);
  }

  onDelete(user: UserListItem) {
    console.log('Delete user', user);
    // on branchera plus tard avec un confirm + appel API
  }
}
