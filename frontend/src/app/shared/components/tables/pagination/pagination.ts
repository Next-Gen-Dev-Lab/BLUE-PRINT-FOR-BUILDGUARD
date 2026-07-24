import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 1;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculatePages();
    }
  }

  calculatePages(): void {
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
    
    // Simple page array builder (maximum 5 visible page numbers around current page)
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  selectPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  get startRange(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endRange(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}
