import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserListItem, UserRole, UsersService } from '../../core/api/users.service';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  mode = signal<'create' | 'edit' | 'view'>('view');
  userId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  user = signal<UserListItem | null>(null);
  form!: FormGroup;
  managers = signal<UserListItem[]>([]);
  loadingManagers = signal(false);
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UsersService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser();
    this.detectMode();
    this.loadManagers();

    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profil: ['USER', Validators.required],
      actif: [true],
      managerId: [null],
      password: [''],
    });
  }

  private detectMode() {
    const { path } = this.route.snapshot.routeConfig!;
    const id = this.route.snapshot.paramMap.get('id');
    if (path === 'users/new') {
      this.mode.set('create');
      return;
    }

    if (path != 'new' && id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        this.userId.set(numericId);
        this.loadUser(numericId);
        return;
      }
    }

    this.error.set('URL invalide');
  }

  roleLabel(role: UserRole | null): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.MANAGER:
        return 'Manager';
      default:
        return 'Utilisateur';
    }
  }

  private loadUser(id: number) {
    this.loading.set(true);

    this.userService.findOne(id).subscribe({
      next: (data) => {
        this.user.set(data);
        this.form.patchValue({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          profil: data.profil,
          actif: data.actif,
          managerId: data.manager?.id ?? null,
        });

        this.setupModeWithPermissions(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger cet utilisateur.');
        this.loading.set(false);
      },
    });
  }

  private loadManagers() {
    this.loadingManagers.set(true);

    this.userService.findManagers().subscribe({
      next: (managers) => {
        this.managers.set(managers);
        this.loadingManagers.set(false);
      },
      error: () => this.loadingManagers.set(false),
    });
  }

  private setupModeWithPermissions(user: UserListItem) {
    const current = this.auth.currentUser();

    // ADMIN → full edit
    if (current.profil === UserRole.ADMIN) {
      this.mode.set('edit');
      return;
    }

    // MANAGER → peut modifier uniquement ses users
    if (current.profil === UserRole.MANAGER && user.manager?.id === current.sub) {
      this.mode.set('edit');
      return;
    } else if (
      (current.profil === UserRole.USER || current.profil === UserRole.MANAGER) &&
      user.id === current.sub
    ) {
      this.mode.set('edit');
      return;
    }

    // USER → lecture seule
    this.mode.set('view');
    this.form.disable();
  }

  onCancel() {
    this.router.navigate(['/users']);
  }

  submit() {
    if (this.form.invalid) return;

    if (this.mode() === 'create') {
      this.userService.create(this.form.value).subscribe({
        next: () => this.router.navigate(['/users']),
      });
    }

    if (this.mode() === 'edit' && this.userId()) {
      this.userService.update(this.userId()!, this.form.value).subscribe({
        next: () => this.router.navigate(['/users']),
      });
    }
  }
}
