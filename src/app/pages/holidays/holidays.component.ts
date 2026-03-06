import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Holiday } from '../../services/api.service';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>🎉 Holiday Management</h1>
        <div class="header-actions">
          <button (click)="seedIndianHolidays()" class="btn btn-secondary" *ngIf="holidays.length === 0">🇮🇳 Seed Indian Holidays</button>
          <button (click)="toggleNewHolidayForm()" class="btn btn-primary">+ Add Holiday</button>
        </div>
      </div>

      @if (showNewHolidayForm) {
        <div class="card form-card">
          <h2>Add New Holiday</h2>
          <form (ngSubmit)="submitNewHoliday()" class="form-grid">
            <div class="form-group">
              <label>Holiday Name</label>
              <input type="text" [(ngModel)]="newHoliday.name" name="name" required placeholder="e.g. Diwali">
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="newHoliday.date" name="date" required>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="newHoliday.is_national" name="is_national" class="select">
                <option [ngValue]="true">National</option>
                <option [ngValue]="false">Company</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="newHoliday.description" name="description" rows="2" placeholder="Brief description..."></textarea>
            </div>
            <div class="form-actions full-width">
              <button type="submit" class="btn btn-success">Add Holiday</button>
              <button type="button" (click)="toggleNewHolidayForm()" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      }

      <div class="card">
        <h2>Holiday Calendar</h2>
        @if (holidays.length === 0) {
          <div class="empty-state">
            <p>No holidays found.</p>
            <button (click)="seedIndianHolidays()" class="btn btn-secondary btn-sm">Seed Indian Holidays (2026)</button>
          </div>
        } @else {
          <div class="holidays-list">
            @for (holiday of holidays; track holiday.id) {
              <div class="holiday-item">
                <div class="holiday-left">
                  <div class="holiday-date">
                    <div class="date-day">{{ getDay(holiday.date) }}</div>
                    <div class="date-month">{{ getMonth(holiday.date) }}</div>
                  </div>
                </div>
                <div class="holiday-middle">
                  <h3>{{ holiday.name }}</h3>
                  <p>{{ holiday.description || 'No description' }}</p>
                  <span class="status-badge" [class.present]="!holiday.is_national" [class.absent]="holiday.is_national">
                    {{ holiday.is_national ? '🇮🇳 National Holiday' : '🏢 Company Holiday' }}
                  </span>
                </div>
                <div class="holiday-right">
                  <button (click)="deleteHoliday(holiday.id)" class="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      margin-left: 272px;
      padding: 2rem;
      background: #070d1d;
      min-height: 100vh;
      color: #eaf0ff;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .page-header h1 {
      margin: 0;
      color: #f7faff;
      font-size: clamp(1.35rem, 1.2rem + 0.8vw, 1.95rem);
      font-weight: 800;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .card {
      background: linear-gradient(160deg, rgba(16, 31, 61, 0.96), rgba(12, 24, 48, 0.96));
      padding: 2rem;
      border-radius: 14px;
      box-shadow: 0 14px 38px rgba(2, 8, 24, 0.45);
      border: 1px solid rgba(120, 150, 255, 0.2);
      backdrop-filter: blur(6px);
      margin-bottom: 1.5rem;
    }

    .card h2 {
      margin-top: 0;
      color: #f1f5f9;
      font-size: 1.2rem;
      border-bottom: 1px solid rgba(120, 150, 255, 0.1);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 0.82rem;
      letter-spacing: 0.03em;
      font-weight: 700;
      color: #9fb0d4;
      margin-bottom: 0.38rem;
      text-transform: uppercase;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 0.65rem 0.78rem;
      background: #112448;
      border: 1px solid rgba(120, 150, 255, 0.28);
      border-radius: 10px;
      color: #eef4ff;
      font-size: 0.95rem;
      outline: none;
      color-scheme: dark;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
    }

    .holidays-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .holiday-item {
      display: flex;
      gap: 1.5rem;
      padding: 1.25rem;
      background: rgba(95, 124, 255, 0.05);
      border: 1px solid rgba(120, 150, 255, 0.15);
      border-radius: 12px;
      transition: all 0.3s;
      align-items: center;
    }

    .holiday-item:hover {
      background: rgba(95, 124, 255, 0.1);
      border-color: rgba(120, 150, 255, 0.3);
      transform: translateY(-2px);
    }

    .holiday-left {
      flex-shrink: 0;
    }

    .holiday-date {
      background: linear-gradient(140deg, #8ca5ff, #6f8aff);
      padding: 0.75rem;
      border-radius: 10px;
      text-align: center;
      color: #0b1531;
      min-width: 65px;
    }

    .date-day {
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1;
    }

    .date-month {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 0.2rem;
    }

    .holiday-middle {
      flex: 1;
    }

    .holiday-middle h3 {
      margin: 0 0 0.4rem 0;
      color: #f7faff;
      font-size: 1.1rem;
    }

    .holiday-middle p {
      margin: 0 0 0.75rem 0;
      color: #9fb0d4;
      font-size: 0.85rem;
    }

    .status-badge {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-badge.present {
      background: rgba(51, 208, 155, 0.15);
      color: #33d09b;
    }

    .status-badge.absent {
      background: rgba(255, 125, 134, 0.15);
      color: #ff7d86;
    }

    .btn {
      padding: 0.6rem 1.1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s;
      font-size: 0.9rem;
    }

    .btn-primary {
      background: linear-gradient(140deg, #8ca5ff, #6f8aff);
      color: #0b1531;
    }

    .btn-success {
      background: #33d09b;
      color: #0b1531;
    }

    .btn-danger {
      background: rgba(255, 125, 134, 0.2);
      color: #ff7d86;
      border: 1px solid rgba(255, 125, 134, 0.3);
    }

    .btn-secondary {
      background: rgba(148, 163, 184, 0.2);
      color: #cbd5e1;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #9fb0d4;
      font-style: italic;
    }

    @media (max-width: 1024px) {
      .page-container {
        margin-left: 0;
        padding: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .holiday-item {
        flex-direction: row;
        text-align: left;
      }
    }
  `]
})
export class HolidaysComponent implements OnInit {
  holidays: Holiday[] = [];
  showNewHolidayForm = false;

  newHoliday = {
    name: '',
    date: '',
    description: '',
    is_national: true
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadHolidays();
  }

  loadHolidays() {
    this.api.getHolidays().subscribe({
      next: (data) => {
        this.holidays = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      error: (err) => console.error('Error loading holidays:', err)
    });
  }

  toggleNewHolidayForm() {
    this.showNewHolidayForm = !this.showNewHolidayForm;
  }

  submitNewHoliday() {
    this.api.addHoliday(this.newHoliday).subscribe({
      next: () => {
        this.loadHolidays();
        this.showNewHolidayForm = false;
        this.newHoliday = { name: '', date: '', description: '', is_national: true };
      },
      error: (err) => console.error('Error adding holiday:', err)
    });
  }

  seedIndianHolidays() {
    const indianHolidays = [
      { name: 'Republic Day', date: '2026-01-26', description: 'National Holiday', is_national: true },
      { name: 'Holi', date: '2026-03-04', description: 'Festival of Colors', is_national: true },
      { name: 'Eid ul-Fitr', date: '2026-03-20', description: 'End of Ramadan', is_national: true },
      { name: 'Independence Day', date: '2026-08-15', description: 'National Holiday', is_national: true },
      { name: 'Gandhi Jayanti', date: '2026-10-02', description: 'Mahatma Gandhi Birthday', is_national: true },
      { name: 'Dussehra', date: '2026-10-21', description: 'Victory of Good over Evil', is_national: true },
      { name: 'Diwali', date: '2026-11-08', description: 'Festival of Lights', is_national: true },
      { name: 'Christmas Day', date: '2026-12-25', description: 'Christian Festival', is_national: true }
    ];

    indianHolidays.forEach(h => {
      this.api.addHoliday(h).subscribe({
        next: () => this.loadHolidays()
      });
    });
  }

  deleteHoliday(id: number) {
    if (confirm('Are you sure you want to delete this holiday?')) {
      this.api.deleteHoliday(id).subscribe({
        next: () => this.loadHolidays(),
        error: (err) => console.error('Error deleting holiday:', err)
      });
    }
  }

  getDay(dateString: string): string {
    return new Date(dateString).getDate().toString().padStart(2, '0');
  }

  getMonth(dateString: string): string {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[new Date(dateString).getMonth()];
  }
}
