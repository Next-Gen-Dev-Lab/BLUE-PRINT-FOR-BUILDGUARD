import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.css']
})
export class ConfirmationDialogComponent implements OnChanges, AfterViewInit {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed with this action?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() isOpen: boolean = false;
  @Input() type: 'danger' | 'info' | 'success' = 'info';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('nativeDialog') nativeDialog!: ElementRef<HTMLDialogElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.nativeDialog) {
      this.toggleDialogState();
    }
  }

  ngAfterViewInit(): void {
    // When element is compiled, sync state
    this.toggleDialogState();
    
    // Add close listener for native escape key dismisses
    this.nativeDialog.nativeElement.addEventListener('close', () => {
      if (this.isOpen) {
        this.isOpen = false;
        this.cancelled.emit();
      }
    });
  }

  toggleDialogState(): void {
    const dialog = this.nativeDialog.nativeElement;
    if (this.isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }

  onConfirm(): void {
    this.isOpen = false;
    this.nativeDialog.nativeElement.close();
    this.confirm.emit();
  }

  onCancel(): void {
    this.isOpen = false;
    this.nativeDialog.nativeElement.close();
    this.cancelled.emit();
  }
}
