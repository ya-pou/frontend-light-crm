import { Component, OnInit, signal } from '@angular/core';
import { UserListItem, UserRole, UsersService } from '../../core/api/users.service';
import { Router } from '@angular/router';
import {
  DataTable,
  DataTableColumn,
} from '../../shared/components/data-table/data-table.component';

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [DataTable],
  templateUrl: `./users.component.html`,
})
export class UsersComponent implements OnInit {
  users = signal<UserListItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  search = signal<string>('');
  columns: DataTableColumn<UserListItem>[] = [
    { key: 'id', label: 'ID', width: '50px', sortable: true },
    { key: 'name', label: 'Prénom', sortable: true },
    { key: 'lastName', label: 'Nom', sortable: true },
    {
      label: 'Rôle',
      format: (row) => ({
        type: 'badge',
        text: row.profil,
        theme:
          row.profil === 'ADMIN'
            ? 'bg-red-100 text-red-700 border-red-300'
            : row.profil === 'MANAGER'
            ? 'bg-blue-100 text-blue-700 border-blue-300'
            : 'bg-gray-100 text-gray-700 border-gray-300',
      }),
      key: '',
    },
    {
      label: 'Manager',
      format: (row) => (row.manager ? `${row.manager.name} ${row.manager.lastName}` : '-'),
      key: '',
    },
  ];
  sortState = signal<{ column: string | null; dir: 'asc' | 'desc' }>({
    column: 'id',
    dir: 'asc',
  });
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

  roleBadgeClasses(role: string) {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'USER':
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  onNewUserClick() {
    this.router.navigate([`users`, `new`]);
  }

  openUser(event: any) {
    console.log(event);
    this.router.navigate(['users', event.id]);
  }

  onSort(column: any) {
    const current = this.sortState();

    const newDir: 'asc' | 'desc' =
      current.column === column && current.dir === 'asc' ? 'desc' : 'asc';

    this.sortState.set({ column, dir: newDir });

    // tri en mémoire sur items()
    const sorted = [...this.users()].sort((a: any, b: any) => {
      const va = a[column];
      const vb = b[column];

      if (va == null && vb == null) return 0;
      if (va == null) return -1;
      if (vb == null) return 1;

      if (typeof va === 'string' && typeof vb === 'string') {
        return va.localeCompare(vb);
      }
      return va > vb ? 1 : va < vb ? -1 : 0;
    });

    if (newDir === 'desc') {
      sorted.reverse();
    }

    this.users.set(sorted);
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
