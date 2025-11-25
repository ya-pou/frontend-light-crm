import { Component, signal } from '@angular/core';
import {
  DataTable,
  DataTableColumn,
  DataTableQuery,
} from '../../shared/components/data-table/data-table.component';
import { CustomerListItem, CustomersService } from '../../core/api/customers.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-customers',
  imports: [DataTable],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  customers = signal<CustomerListItem[]>([]);
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

  columns: DataTableColumn<CustomerListItem>[] = [
    { key: 'id', label: 'ID', width: '50px', sortable: true },
    { key: 'name', label: 'Prénom', sortable: true },
    { key: 'lastName', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telephone', label: 'Télephone', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'sector', label: 'Secteur', sortable: true },
    {
      key: '',
      label: 'Responsable',
      format: (row) => (row.user ? `${row.user.name} ${row.user.lastName}` : '-'),
    },
  ];

  constructor(private customersService: CustomersService, private router: Router) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService
      .getCustomers({
        page: this.query().page,
        limit: this.query().limit,
        search: this.query().search,
        sort: this.query().col,
        dir: this.query().dir,
      })
      .subscribe({
        next: (res: any) => {
          this.customers.set(res.data);
          this.query.set({ ...this.query(), total: res.meta.total });
          this.query.set({ ...this.query(), totalPages: res.meta.totalPages });
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          console.log(error);
        },
      });
  }

  updateQuery(newQuery: DataTableQuery) {
    this.query.set(newQuery);
    this.loadCustomers();
  }

  onNewClientClick() {
    this.router.navigate([`customers`, `new`]);
  }

  openClient(event: any) {
    console.log(event);
    this.router.navigate(['customers', event.id]);
  }

  onEdit(customerId: number) {
    this.router.navigate([`customers`, `${customerId.toString()}`]);
  }
}
