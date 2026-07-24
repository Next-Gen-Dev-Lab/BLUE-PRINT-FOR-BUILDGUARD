import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../../core/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit {
  toasts$!: Observable<ToastMessage[]>;

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toasts$ = this.toastService.toasts$;
  }

  dismiss(id: string): void {
    this.toastService.remove(id);
  }
}
