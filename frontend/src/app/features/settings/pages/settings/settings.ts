import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loaders/loading-spinner/loading-spinner';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  // Theme Mode
  isDarkTheme = false;

  // Preferences Toggles
  emailAlerts = true;
  smsAlerts = false;
  pushAlerts = true;
  aiCriticalPriorityOnly = false;

  // Integrations
  apiKey = 'bg_live_8afc381da0d127bcfb92e8fa48c26bc781';
  webhookUrl = 'https://api.yourcompany.com/buildguard-webhooks';
  isWebhookSaved = false;

  isSaving = false;

  constructor(
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    // Detect theme class on body element
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Load persisted settings
    const emailPref = localStorage.getItem('bg_pref_email');
    if (emailPref !== null) this.emailAlerts = emailPref === 'true';
    
    const smsPref = localStorage.getItem('bg_pref_sms');
    if (smsPref !== null) this.smsAlerts = smsPref === 'true';

    const pushPref = localStorage.getItem('bg_pref_push');
    if (pushPref !== null) this.pushAlerts = pushPref === 'true';
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('bg_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('bg_theme', 'light');
    }
    this.toast.info(`Theme toggled to ${this.isDarkTheme ? 'Dark Mode' : 'Light Mode'}`);
  }

  savePreferences(): void {
    this.isSaving = true;
    
    // Persist configurations
    localStorage.setItem('bg_pref_email', String(this.emailAlerts));
    localStorage.setItem('bg_pref_sms', String(this.smsAlerts));
    localStorage.setItem('bg_pref_push', String(this.pushAlerts));

    setTimeout(() => {
      this.isSaving = false;
      this.toast.success('System preferences saved successfully.');
    }, 1000);
  }

  copyApiKey(): void {
    navigator.clipboard.writeText(this.apiKey).then(() => {
      this.toast.success('API Access key copied to clipboard.');
    });
  }

  saveWebhook(): void {
    if (!this.webhookUrl.trim()) return;
    this.toast.success('Webhook endpoint configuration updated.');
    this.isWebhookSaved = true;
  }

  resetMockCache(): void {
    this.isSaving = true;
    localStorage.clear();
    setTimeout(() => {
      this.isSaving = false;
      this.toast.success('Local Storage databases cleared and session reset.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 1200);
  }
}
