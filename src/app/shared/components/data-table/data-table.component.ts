import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  class?: string;
  format?: (row: T) => any;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTable<T> {
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() loading = false;

  // Pour la pagination, le tri, etc.
  @Output() sort = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<T>();

  sortColumn(col: DataTableColumn<T>) {
    col.sortable ? this.sort.emit(col.key as string) : null;
  }

  getCellValue(row: T, col: DataTableColumn<T>) {
    if (col.format) return col.format(row);
    if (col.key) return row[col.key as keyof T];
    return row[col.key as keyof T];
  }

  onSort(col: DataTableColumn<T>) {
    col.sortable ? this.sort.emit(col.key as string) : null;
  }
}
