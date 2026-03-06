import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Department } from '../../services/api.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>🏭 Department Management</h1>
        <button (click)="toggleNewDeptForm()" class="btn btn-primary">+ Add Department</button>
      </div>

      @if (showNewDeptForm) {
        <div class="card form-card">
          <h2>Add New Department</h2>
          <form (ngSubmit)="submitNewDept()" class="form-grid">
            <div class="form-group full-width">
              <label>Department Name</label>
              <input type="text" [(ngModel)]="newDept.name" name="name" required placeholder="e.g. IT, Sales, HR">
              <div class="suggestions">
                <span (click)="newDept.name='IT'" class="suggestion-chip">IT</span>
                <span (click)="newDept.name='Sales'" class="suggestion-chip">Sales</span>
                <span (click)="newDept.name='HR'" class="suggestion-chip">HR</span>
                <span (click)="newDept.name='Marketing'" class="suggestion-chip">Marketing</span>
                <span (click)="newDept.name='Accounts'" class="suggestion-chip">Accounts</span>
              </div>
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="newDept.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-actions full-width">
              <button type="submit" class="btn btn-success">Add Department</button>
              <button type="button" (click)="toggleNewDeptForm()" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      }

      <div class="card">
        <div class="card-header-with-action">
          <h2>All Departments</h2>
          @if (departments.length === 0) {
            <button (click)="seedSampleDepartments()" class="btn btn-sm btn-secondary">Seed Samples</button>
          }
        </div>
        
        @if (departments.length === 0) {
          <div class="empty-state">No departments found. Use "Seed Samples" to quickly add some.</div>
        } @else {
          <div class="dept-grid">
            @for (dept of departments; track dept.id) {
              <div class="dept-card">
                <div class="dept-header">
                  <h3>{{ dept.name }}</h3>
                  <div class="dept-actions">
                    <button (click)="editDept(dept)" class="btn btn-sm btn-secondary">Edit</button>
                    <button (click)="deleteDept(dept.id)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </div>
                <p class="dept-desc">{{ dept.description || 'No description' }}</p>
              </div>
            }
          </div>
        }
      </div>

      @if (editingDept) {
        <div class="card form-card">
          <h2>Edit Department</h2>
          <form (ngSubmit)="submitEditDept()" class="form-grid">
            <div class="form-group full-width">
              <label>Department Name</label>
              <input type="text" [(ngModel)]="editingDept.name" name="name" required>
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="editingDept.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-actions full-width">
              <button type="submit" class="btn btn-success">Save Changes</button>
              <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      }
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

    .card {
      background: linear-gradient(160deg, rgba(16, 31, 61, 0.96), rgba(12, 24, 48, 0.96));
      padding: 2rem;
      border-radius: 14px;
      box-shadow: 0 14px 38px rgba(2, 8, 24, 0.45);
      border: 1px solid rgba(120, 150, 255, 0.2);
      backdrop-filter: blur(6px);
      margin-bottom: 1.5rem;
    }

    .card-header-with-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(120, 150, 255, 0.1);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .card h2 {
      margin: 0;
      color: #f1f5f9;
      font-size: 1.2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
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
    .form-group textarea {
      padding: 0.65rem 0.78rem;
      background: #112448;
      border: 1px solid rgba(120, 150, 255, 0.28);
      border-radius: 10px;
      color: #eef4ff;
      font-size: 0.95rem;
      outline: none;
    }

    .suggestions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .suggestion-chip {
      background: rgba(95, 124, 255, 0.1);
      border: 1px solid rgba(95, 124, 255, 0.2);
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      color: #85a0ff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .suggestion-chip:hover {
      background: rgba(95, 124, 255, 0.2);
      border-color: #85a0ff;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
    }

    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .dept-card {
      background: rgba(95, 124, 255, 0.05);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(120, 150, 255, 0.15);
      transition: all 0.3s;
    }

    .dept-card:hover {
      background: rgba(95, 124, 255, 0.1);
      border-color: rgba(120, 150, 255, 0.3);
      transform: translateY(-2px);
    }

    .dept-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .dept-header h3 {
      margin: 0;
      color: #85a0ff;
      font-size: 1.1rem;
    }

    .dept-actions {
      display: flex;
      gap: 0.5rem;
    }

    .dept-desc {
      color: #9fb0d4;
      margin: 0;
      font-size: 0.9rem;
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
  `]
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  showNewDeptForm = false;
  editingDept: Department | null = null;

  newDept = {
    name: '',
    description: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.api.getEmployees(); // Dummy call to ensure API is ready if needed
    this.api.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  toggleNewDeptForm() {
    this.showNewDeptForm = !this.showNewDeptForm;
  }

  submitNewDept() {
    this.api.addDepartment(this.newDept).subscribe({
      next: () => {
        this.loadDepartments();
        this.showNewDeptForm = false;
        this.newDept = { name: '', description: '' };
      },
      error: (err) => console.error('Error adding department:', err)
    });
  }

  editDept(dept: Department) {
    this.editingDept = { ...dept };
  }

  submitEditDept() {
    if (this.editingDept) {
      this.api.updateDepartment(this.editingDept.id, {
        name: this.editingDept.name,
        description: this.editingDept.description
      }).subscribe({
        next: () => {
          this.loadDepartments();
          this.editingDept = null;
        },
        error: (err) => console.error('Error updating department:', err)
      });
    }
  }

  cancelEdit() {
    this.editingDept = null;
  }

  seedSampleDepartments() {
    const samples = [
      { name: 'Engineering', description: 'Software and Hardware development' },
      { name: 'Human Resources', description: 'Talent management and employee relations' },
      { name: 'Marketing', description: 'Sales and brand promotion' },
      { name: 'Finance', description: 'Accounting and financial planning' }
    ];
    
    samples.forEach(sample => {
      this.api.addDepartment(sample).subscribe({
        next: () => this.loadDepartments()
      });
    });
  }

  deleteDept(id: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.api.deleteDepartment(id).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => console.error('Error deleting department:', err)
      });
    }
  }
}
