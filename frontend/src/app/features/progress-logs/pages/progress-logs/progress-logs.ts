import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { ProgressLogService } from '../../../../core/services/progress-log.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Project, DailyLog } from '../../../../core/models';
import { FileUploadComponent } from '../../../../shared/components/forms/file-upload/file-upload';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-progress-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent, LoadingSpinnerComponent],
  templateUrl: './progress-logs.html',
  styleUrls: ['./progress-logs.css']
})
export class ProgressLogsComponent implements OnInit {
  logForm!: FormGroup;
  projects: Project[] = [];
  isLoading = false;
  isSubmitting = false;

  weatherOptions = [
    { value: 'Sunny - 78°F / 25°C', label: 'Sunny (Clear Sky)' },
    { value: 'Partly Cloudy - 75°F', label: 'Partly Cloudy' },
    { value: 'Rainy - 64°F / 18°C', label: 'Rainy (Wet Conditions)' },
    { value: 'Windy - 70°F', label: 'Windy' },
    { value: 'Overcast - 68°F', label: 'Overcast' }
  ];

  attachedImages: File[] = [];
  attachedPDFs: File[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly progressLogService: ProgressLogService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    
    // Load projects list for the select dropdown
    this.projectService.getProjects().subscribe({
      next: (projs) => {
        this.projects = projs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Initialize Reactive Form
    this.logForm = this.fb.group({
      projectId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      location: ['', Validators.required],
      workDescription: ['', [Validators.required, Validators.minLength(15)]],
      materialUsed: [''],
      workersCount: [0, [Validators.required, Validators.min(0)]],
      weather: ['Sunny - 78°F / 25°C', Validators.required],
      notes: ['']
    });

    // Reactively update location when project changes (mock automation)
    this.logForm.get('projectId')?.valueChanges.subscribe(projId => {
      const selectedProj = this.projects.find(p => p.id === projId);
      if (selectedProj) {
        this.logForm.patchValue({ location: selectedProj.location });
      }
    });
  }

  onImagesSelected(files: File[]): void {
    this.attachedImages = files;
  }

  onPDFsSelected(files: File[]): void {
    this.attachedPDFs = files;
  }

  submitLog(isDraft: boolean): void {
    if (!isDraft && this.logForm.invalid) {
      this.logForm.markAllAsTouched();
      this.toast.warning('Please resolve all validation errors in the work log.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.logForm.value;

    const payload: Omit<DailyLog, 'id' | 'projectName'> = {
      projectId: formData.projectId,
      date: formData.date,
      location: formData.location,
      workDescription: formData.workDescription,
      materialUsed: formData.materialUsed || 'None',
      workersCount: formData.workersCount,
      weather: formData.weather,
      notes: formData.notes || '',
      status: isDraft ? 'draft' : 'submitted',
      imageMockups: this.attachedImages.map(f => f.name),
      pdfMockups: this.attachedPDFs.map(f => f.name)
    };

    // If uploading files, we can wrap in FormData to fulfill POST /progress-logs/upload specs
    const formPayload = new FormData();
    formPayload.append('projectId', payload.projectId);
    formPayload.append('date', payload.date);
    formPayload.append('location', payload.location);
    formPayload.append('workDescription', payload.workDescription);
    formPayload.append('materialUsed', payload.materialUsed);
    formPayload.append('workersCount', String(payload.workersCount));
    formPayload.append('weather', payload.weather);
    formPayload.append('notes', payload.notes || '');
    formPayload.append('status', payload.status);
    
    this.attachedImages.forEach(file => formPayload.append('images', file));
    this.attachedPDFs.forEach(file => formPayload.append('pdfs', file));

    // Fall back to JSON payload if backend expects JSON instead of multipart
    this.progressLogService.createProgressLog(formPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        if (isDraft) {
          this.toast.success('Daily progress log saved as Draft.');
        } else {
          this.toast.success('Daily progress log submitted successfully.');
        }
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Retry with standard JSON if FormData upload fails
        const jsonPayload: DailyLog = {
          ...payload,
          id: '',
          projectName: ''
        };
        this.progressLogService.createProgressLog(jsonPayload).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.toast.success('Daily progress log submitted successfully.');
            this.router.navigate(['/dashboard']);
          },
          error: (err2) => {
            this.isSubmitting = false;
            this.toast.error(err2.message || 'Error saving daily progress log.');
          }
        });
      }
    });
  }
}
