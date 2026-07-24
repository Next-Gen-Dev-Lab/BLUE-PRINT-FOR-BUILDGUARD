import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'progress' | 'badge' | 'custom';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class DataTableComponent implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actionsEnabled: boolean = false;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  sortedData: any[] = [];
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.sortedData = [...this.data];
      if (this.sortKey) {
        this.applySort();
      }
    }
  }

  onHeaderClick(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  applySort(): void {
    this.sortedData.sort((a, b) => {
      let valA = a[this.sortKey];
      let valB = b[this.sortKey];

      valA ??= '';
      valB ??= '';

      // Type checks
      if (typeof valA === 'string') {
        return this.sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc'
          ? (valA - valB)
          : (valB - valA);
      }
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onAction(action: string, row: any, event: MouseEvent): void {
    event.stopPropagation(); // Avoid firing rowClick
    this.actionClick.emit({ action, row });
  }

  // Common badge status resolver helper inside template
  getBadgeClass(val: string): string {
    const v = val ? val.toLowerCase() : '';
    if (v.includes('pass') || v.includes('active') || v.includes('resolved') || v.includes('completed')) return 'badge-success';
    if (v.includes('fail') || v.includes('critical') || v.includes('delayed')) return 'badge-danger';
    if (v.includes('pending') || v.includes('schedule') || v.includes('investigating') || v.includes('high')) return 'badge-warning';
    return 'badge-secondary';
  }
}
