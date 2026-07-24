import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { User } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../../shared/components/tables/pagination/pagination';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent, PaginationComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  isLoading = true;
  isSubmitting = false;

  // Search, Filter, Sort and Paginate parameters
  searchQuery: string = '';
  roleFilter: string = '';
  statusFilter: string = '';
  sortBy: 'name' | 'employeeId' | 'role' | 'status' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination parameters
  currentPage = 1;
  itemsPerPage = 5;

  // Modal Dialogs properties
  isAddEditModalOpen = false;
  isDeleteConfirmOpen = false;
  selectedUser: User | null = null;
  userForm!: FormGroup;

  roleOptions = [
    { value: 'admin', label: 'Safety Admin' },
    { value: 'engineer', label: 'Project Engineer' },
    { value: 'inspector', label: 'Safety Inspector' },
    { value: 'foreman', label: 'Site Foreman' }
  ];

  statusOptions = [
    { value: 'active', label: 'Active Account' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      employeeId: ['', [Validators.required, Validators.pattern(/^EMP-\d{4}$/)]],
      companyName: ['Apex Builders Inc.', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/)]],
      role: ['foreman', Validators.required],
      status: ['active', Validators.required]
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (list) => {
        this.users = list;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(err.message || 'Error loading employee directories.');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.users];

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q) ||
        u.companyName.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (this.roleFilter) {
      result = result.filter(u => u.role === this.roleFilter);
    }

    // Status filter
    if (this.statusFilter) {
      result = result.filter(u => u.status === this.statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const fieldA = String(a[this.sortBy]).toLowerCase();
      const fieldB = String(b[this.sortBy]).toLowerCase();
      
      if (this.sortOrder === 'asc') {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

    this.filteredUsers = result;
    this.currentPage = 1;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  changeSort(field: 'name' | 'employeeId' | 'role' | 'status'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  openAddModal(): void {
    this.selectedUser = null;
    this.userForm.reset({
      companyName: 'Apex Builders Inc.',
      role: 'foreman',
      status: 'active'
    });
    this.isAddEditModalOpen = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.isAddEditModalOpen = true;
  }

  closeAddEditModal(): void {
    this.isAddEditModalOpen = false;
    this.selectedUser = null;
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toast.warning('Check input fields for validation errors.');
      return;
    }

    this.isSubmitting = true;
    const payload: User = {
      ...this.userForm.value,
      id: this.selectedUser ? this.selectedUser.id : ''
    };

    this.userService.saveUser(payload).subscribe({
      next: (saved) => {
        this.isSubmitting = false;
        this.toast.success(`User Account for ${saved.name} saved successfully.`);
        this.loadUsers();
        this.closeAddEditModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error saving user account.');
      }
    });
  }

  openDeleteConfirm(user: User): void {
    this.selectedUser = user;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.selectedUser = null;
  }

  confirmDelete(): void {
    if (!this.selectedUser) return;
    this.isSubmitting = true;

    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success(`Deleted user account for ${this.selectedUser?.name}`);
        this.loadUsers();
        this.closeDeleteConfirm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error deleting account.');
      }
    });
  }

  toggleUserStatus(user: User): void {
    this.isLoading = true;
    const updatedUser: User = {
      ...user,
      status: user.status === 'active' ? 'pending' : 'active'
    };

    this.userService.saveUser(updatedUser).subscribe({
      next: () => {
        this.toast.info(`Status of ${user.name} toggled successfully.`);
        this.loadUsers();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to change status.');
      }
    });
  }

  getUserRoleLabel(role?: string): string {
    if (!role) return '';
    switch (role) {
      case 'admin': return 'Safety Admin';
      case 'engineer': return 'Project Engineer';
      case 'inspector': return 'Safety Inspector';
      case 'foreman': return 'Site Foreman';
      default: return role;
    }
  }
}
