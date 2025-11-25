import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserListItem, UserRole } from '../../core/api/users.service';
import { CustomerListItem, CustomersService } from '../../core/api/customers.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
})
export class CustomerFormComponent implements OnInit {
  mode = signal<'create' | 'edit' | 'view'>('view');
  customerId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string>('');
  customer = signal<CustomerListItem | null>(null);
  users = signal<any[]>([]);
  form!: FormGroup;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private customerService: CustomersService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.currentUser();
    this.detectMode();

    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //Todo validate email format
      telephone: [''],
      sector: [''],
      status: [''],
      userId: [null],
    });
  }

  private detectMode() {
    const { path } = this.route.snapshot.routeConfig!;
    const id = this.route.snapshot.paramMap.get('id');
    console.log(path);
    if (path === 'customers/new') {
      this.mode.set('create');
      return;
    }

    if (path != 'new' && id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        this.customerId.set(numericId);
        this.loadCUstomer(numericId);
        return;
      }
    }

    this.error.set('URL invalide');
  }

  private setupModeWithPermissions(customer: CustomerListItem) {
    const current = this.auth.currentUser();

    // ADMIN → full edit
    if (current.profil === UserRole.ADMIN) {
      this.mode.set('edit');
      return;
    }

    // MANAGER → peut modifier uniquement ses clients et les clients de ses utilisateurs
    console.log(current.profil === UserRole.MANAGER);

    if (current.profil === UserRole.MANAGER && customer.user?.id === current.sub) {
      this.mode.set('edit');
      return;
    } else if (
      //Modification de leur propre client
      (current.profil === UserRole.USER || current.profil === UserRole.MANAGER) &&
      customer.user?.id === current.sub
    ) {
      this.mode.set('edit');
      return;
    }

    // USER → lecture seule
    this.mode.set('view');
    this.form.disable();
  }

  loadCUstomer(id: number) {
    this.customerService.findOne(id).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.form.patchValue({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          telephone: data.telephone,
          sector: data.sector,
          status: data.status,
          userId: data.user?.id ?? null,
        });
        this.setupModeWithPermissions(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/customers']);
  }

  onSubmit() {
    console.log(this.form.invalid);
    if (this.form.invalid) return;

    if (this.mode() === 'create') {
      this.customerService.create(this.form.value).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (error) => {
          console.log(error);
        },
      });
    }

    if (this.mode() === 'edit') {
      this.customerService.update(this.customerId()!, this.form.value).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (error) => console.log(error),
      });
    }
  }
}
