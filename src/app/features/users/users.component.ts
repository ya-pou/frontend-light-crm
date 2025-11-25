import { Component, OnInit, signal } from '@angular/core';
import { UserListItem, UserRole, UsersService } from '../../core/api/users.service';
import { Router } from '@angular/router';
import {
  DataTable,
  DataTableColumn,
  DataTableQuery,
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
  query = signal<DataTableQuery>({
    page: 1,
    limit: 10,
    search: '',
    col: 'id',
    dir: 'asc',
    totalPages: 1,
    limits: [10, 25, 50],
    total: 0,
  });

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

  readonly UserRole = UserRole;

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService
      .getUsers({
        page: this.query().page,
        limit: this.query().limit,
        search: this.query().search,
        sort: this.query().col,
        dir: this.query().dir,
      })
      .subscribe({
        next: (res: any) => {
          this.users.set(res.data);
          this.query.set({ ...this.query(), total: res.meta.total });
          this.query.set({ ...this.query(), totalPages: res.meta.totalPages });
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
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

  updateQuery(newQuery: DataTableQuery) {
    this.query.set(newQuery);
    this.loadUsers();
  }

  onNewUserClick() {
    this.router.navigate([`users`, `new`]);
  }

  openUser(event: any) {
    console.log(event);
    this.router.navigate(['users', event.id]);
  }

  onEdit(userId: number) {
    this.router.navigate([`users`, `${userId.toString()}`]);
  }

  onDelete(user: UserListItem) {
    console.log('Delete user', user);
    // on branchera plus tard avec un confirm + appel API
  }
}
