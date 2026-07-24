import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { ProjectService } from '../../../../core/services/project.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Schedule, Project } from '../../../../core/models';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../../shared/components/tables/pagination/pagination';

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent, PaginationComponent],
  templateUrl: './schedules.html',
  styleUrls: ['./schedules.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  paginatedSchedules: Schedule[] = [];
  projects: Project[] = [];
  isLoading = true;
  isSubmitting = false;

  // View Mode: 'calendar' or 'list'
  viewMode: 'calendar' | 'list' = 'calendar';

  // Search & Filter state
  searchQuery: string = '';
  projectFilter: string = '';
  typeFilter: string = '';

  // Pagination parameters
  currentPage = 1;
  itemsPerPage = 5;

  // Modals state
  isAddEditModalOpen = false;
  isDeleteConfirmOpen = false;
  selectedSchedule: Schedule | null = null;
  scheduleForm!: FormGroup;

  // Calendar variables
  currentMonth = new Date(2026, 6, 1); // July 2026
  calendarWeeks: { dayNumber: number | null; dateString: string | null; schedules: Schedule[] }[][] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  typeOptions = [
    { value: 'inspection', label: 'Safety Audit' },
    { value: 'maintenance', label: 'Equipment Maintenance' },
    { value: 'safety_meeting', label: 'Briefing Session' },
    { value: 'drill', label: 'Hazard Drill' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly scheduleService: ScheduleService,
    private readonly projectService: ProjectService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.scheduleForm = this.fb.group({
      id: [''],
      projectId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      time: ['09:00', Validators.required],
      type: ['inspection', Validators.required],
      assignedTo: ['', Validators.required],
      status: ['scheduled', Validators.required]
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe(projs => this.projects = projs);

    this.scheduleService.getSchedules().subscribe({
      next: (scheds) => {
        this.schedules = scheds;
        this.applyFilters();
        this.generateCalendar();
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(err.message || 'Error loading schedules.');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.schedules];

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.projectName.toLowerCase().includes(q) ||
        s.assignedTo.toLowerCase().includes(q)
      );
    }

    // Project filter
    if (this.projectFilter) {
      result = result.filter(s => s.projectId === this.projectFilter);
    }

    // Type filter
    if (this.typeFilter) {
      result = result.filter(s => s.type === this.typeFilter);
    }

    // Sort by date/time ascending
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    this.filteredSchedules = result;
    this.currentPage = 1;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSchedules = this.filteredSchedules.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  // --- Calendar Builder ---
  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // First day of month (0 = Sunday, 1 = Monday...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    const weeks: any[][] = [];
    let currentWeek: any[] = [];

    // Fill offset slots for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek.push({ dayNumber: null, dateString: null, schedules: [] });
    }

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const daySchedules = this.schedules.filter(s => s.date === dateStr);

      currentWeek.push({
        dayNumber: day,
        dateString: dateStr,
        schedules: daySchedules
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill offset slots for next month
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ dayNumber: null, dateString: null, schedules: [] });
      }
      weeks.push(currentWeek);
    }

    this.calendarWeeks = weeks;
  }

  changeMonth(dir: number): void {
    const month = this.currentMonth.getMonth();
    this.currentMonth = new Date(this.currentMonth.getFullYear(), month + dir, 1);
    this.generateCalendar();
  }

  // --- CRUD Modals triggers ---
  openAddModal(): void {
    this.selectedSchedule = null;
    this.scheduleForm.reset({
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'inspection',
      status: 'scheduled'
    });
    this.isAddEditModalOpen = true;
  }

  openEditModal(sched: Schedule): void {
    this.selectedSchedule = sched;
    this.scheduleForm.patchValue(sched);
    this.isAddEditModalOpen = true;
  }

  closeAddEditModal(): void {
    this.isAddEditModalOpen = false;
    this.selectedSchedule = null;
  }

  submitForm(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.toast.warning('Check inputs for errors.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.scheduleForm.value;
    const selectedProj = this.projects.find(p => p.id === formData.projectId);

    const payload: Omit<Schedule, 'id'> & { id?: string } = {
      ...formData,
      projectName: selectedProj ? selectedProj.name : 'Unknown Project',
      id: this.selectedSchedule ? this.selectedSchedule.id : undefined
    };

    this.scheduleService.saveSchedule(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success('Schedule item updated.');
        this.loadData();
        this.closeAddEditModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error updating schedule.');
      }
    });
  }

  openDeleteConfirm(sched: Schedule): void {
    this.selectedSchedule = sched;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.selectedSchedule = null;
  }

  confirmDelete(): void {
    if (!this.selectedSchedule) return;
    this.isSubmitting = true;

    this.scheduleService.deleteSchedule(this.selectedSchedule.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success('Schedule event deleted.');
        this.loadData();
        this.closeDeleteConfirm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.message || 'Error deleting event.');
      }
    });
  }

  getScheduleTypeLabel(type: string): string {
    switch (type) {
      case 'inspection': return 'Safety Audit';
      case 'maintenance': return 'Equipment Maintenance';
      case 'safety_meeting': return 'Briefing Session';
      case 'drill': return 'Hazard Drill';
      default: return type;
    }
  }

  getBadgeClass(type: string): string {
    switch (type) {
      case 'inspection': return 'badge-info';
      case 'drill': return 'badge-danger';
      case 'maintenance': return 'badge-warning';
      case 'safety_meeting': return 'badge-success';
      default: return '';
    }
  }
}
