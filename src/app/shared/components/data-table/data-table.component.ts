import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AArrowDown, LucideAngularModule } from 'lucide-angular';
import { AArrowUp } from 'lucide-angular/src/icons';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  class?: string;
  format?: (row: T) => any;
}

export interface DataTableQuery {
  page: number;
  totalPages: number;
  limit: number;
  limits: number[];
  search: string;
  total: number;
  col: string | undefined;
  dir: 'asc' | 'desc';
  filters?: Record<string, any>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass, LucideAngularModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTable<T> {
  // Icons
  readonly AArrowDown = AArrowDown;
  readonly AArrowUp = AArrowUp;

  @Input() rows: T[] = [];
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() loading = false;
  @Input() query!: DataTableQuery;

  // Pour la pagination, le tri, etc.
  @Output() sort = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() search = new EventEmitter<string>();
  @Output() queryChange = new EventEmitter<DataTableQuery>();

  sortColumn(col: DataTableColumn<T>) {
    col.sortable ? this.sort.emit(col.key as string) : null;
  }

  getCellValue(row: T, col: DataTableColumn<T>) {
    if (col.format) return col.format(row);
    if (col.key) return row[col.key as keyof T];
    return row[col.key as keyof T];
  }

  onSearch(term: string) {
    this.queryChange.emit({
      ...this.query,
      search: term,
      page: 1,
    });
  }

  onLimitChange(event: Event) {
    const newLimit = Number((event.target as HTMLSelectElement).value);

    this.queryChange.emit({
      ...this.query,
      limit: newLimit,
      page: 1,
    });
  }

  onSort(column: string | undefined) {
    let newDir: 'asc' | 'desc' = 'asc';

    if (this.query.col === column) {
      newDir = this.query.dir === 'asc' ? 'desc' : 'asc';
    }

    this.queryChange.emit({
      ...this.query,
      col: column,
      dir: newDir,
      page: 1,
    });
  }

  onPageChange(newPage: number) {
    this.queryChange.emit({
      ...this.query,
      page: newPage,
    });
  }

  get startIndex(): number {
    if (this.query.total === 0) return 0;
    return (this.query.page - 1) * this.query.limit + 1;
  }

  get endIndex(): number {
    return Math.min(this.query.page * this.query.limit, this.query.total);
  }

  get pageInfo(): string {
    if (this.query.total === 0) return '0 résultat';
    return `${this.startIndex}-${this.endIndex} sur ${this.query.total} résultat${
      this.query.total > 1 ? 's' : ''
    }`;
  }
}
