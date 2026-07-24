import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUploadComponent {
  @Input() accept: string = '*/*';
  @Input() multiple: boolean = false;
  @Input() helperText: string = 'PDF, PNG, JPG up to 10MB';
  
  @Output() filesSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  selectedFiles: File[] = [];
  isDragOver = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files) {
      this.handleFileSelection(Array.from(event.dataTransfer.files));
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFileSelection(Array.from(input.files));
    }
  }

  triggerInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileSelection(files: File[]): void {
    // Filter by accepted types if necessary in production
    if (this.multiple) {
      this.selectedFiles = [...this.selectedFiles, ...files];
    } else {
      this.selectedFiles = files.slice(0, 1);
    }
    this.filesSelected.emit(this.selectedFiles);
  }

  removeFile(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);
    this.filesSelected.emit(this.selectedFiles);
  }

  clearFiles(): void {
    this.selectedFiles = [];
    this.filesSelected.emit([]);
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = Math.max(0, decimals);
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
