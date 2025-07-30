import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

export interface FormFieldOption {
  value: any;
  label: string;
}

export interface FormFieldConfig {
  key: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'slider' | 'toggle' | 'chips' | 'autocomplete';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  validators?: any[];
  description?: string;
  defaultValue?: any;
}

export interface DynamicFormConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}

@Component({
  selector: 'app-dynamic-forms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  template: `
    <div class="forms-container fade-in">
      <!-- Header -->
      <div class="forms-header">
        <h1 class="forms-title">
          <mat-icon class="title-icon">description</mat-icon>
          Dynamic Forms
        </h1>
        <p class="forms-subtitle">Interactive forms with various field types and validation</p>
      </div>

      <!-- Form Tabs -->
      <mat-tab-group class="form-tabs" [(selectedIndex)]="selectedTabIndex">
        <mat-tab *ngFor="let formConfig of formConfigs; let i = index" [label]="formConfig.title">
          <div class="tab-content">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>{{ formConfig.title }}</mat-card-title>
                <mat-card-subtitle *ngIf="formConfig.description">{{ formConfig.description }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <form [formGroup]="dynamicForms[i]" (ngSubmit)="onSubmit(i)" class="dynamic-form">
                  <div class="form-grid">
                    <ng-container *ngFor="let field of formConfig.fields">
                      <!-- Text Input Fields -->
                      <mat-form-field 
                        *ngIf="['text', 'email', 'password', 'number'].includes(field.type)"
                        appearance="outline" 
                        class="form-field">
                        <mat-label>{{ field.label }}</mat-label>
                        <input 
                          matInput 
                          [type]="field.type === 'password' ? 'password' : (field.type === 'number' ? 'number' : 'text')"
                          [formControlName]="field.key"
                          [placeholder]="field.placeholder || ''"
                          [readonly]="field.disabled">
                        <mat-hint *ngIf="field.description">{{ field.description }}</mat-hint>
                        <mat-error *ngIf="getFieldError(i, field.key)">
                          {{ getFieldError(i, field.key) }}
                        </mat-error>
                      </mat-form-field>

                      <!-- Textarea -->
                      <mat-form-field 
                        *ngIf="field.type === 'textarea'"
                        appearance="outline" 
                        class="form-field full-width">
                        <mat-label>{{ field.label }}</mat-label>
                        <textarea 
                          matInput 
                          [formControlName]="field.key"
                          [placeholder]="field.placeholder || ''"
                          [rows]="field.rows || 4"
                          [readonly]="field.disabled">
                        </textarea>
                        <mat-hint *ngIf="field.description">{{ field.description }}</mat-hint>
                        <mat-error *ngIf="getFieldError(i, field.key)">
                          {{ getFieldError(i, field.key) }}
                        </mat-error>
                      </mat-form-field>

                      <!-- Select Dropdown -->
                      <mat-form-field 
                        *ngIf="field.type === 'select'"
                        appearance="outline" 
                        class="form-field">
                        <mat-label>{{ field.label }}</mat-label>
                        <mat-select 
                          [formControlName]="field.key"
                          [disabled]="field.disabled">
                          <mat-option *ngFor="let option of field.options" [value]="option.value">
                            {{ option.label }}
                          </mat-option>
                        </mat-select>
                        <mat-hint *ngIf="field.description">{{ field.description }}</mat-hint>
                        <mat-error *ngIf="getFieldError(i, field.key)">
                          {{ getFieldError(i, field.key) }}
                        </mat-error>
                      </mat-form-field>

                      <!-- Multi Select -->
                      <mat-form-field 
                        *ngIf="field.type === 'multiselect'"
                        appearance="outline" 
                        class="form-field">
                        <mat-label>{{ field.label }}</mat-label>
                        <mat-select 
                          [formControlName]="field.key"
                          [disabled]="field.disabled"
                          multiple>
                          <mat-option *ngFor="let option of field.options" [value]="option.value">
                            {{ option.label }}
                          </mat-option>
                        </mat-select>
                        <mat-hint *ngIf="field.description">{{ field.description }}</mat-hint>
                        <mat-error *ngIf="getFieldError(i, field.key)">
                          {{ getFieldError(i, field.key) }}
                        </mat-error>
                      </mat-form-field>

                      <!-- Checkbox -->
                      <div *ngIf="field.type === 'checkbox'" class="form-field checkbox-field">
                        <mat-checkbox 
                          [formControlName]="field.key"
                          [disabled]="field.disabled">
                          {{ field.label }}
                        </mat-checkbox>
                        <div *ngIf="field.description" class="field-description">{{ field.description }}</div>
                      </div>

                      <!-- Radio Buttons -->
                      <div *ngIf="field.type === 'radio'" class="form-field radio-field full-width">
                        <label class="field-label">{{ field.label }}</label>
                        <mat-radio-group 
                          [formControlName]="field.key"
                          [disabled]="field.disabled"
                          class="radio-group">
                          <mat-radio-button 
                            *ngFor="let option of field.options" 
                            [value]="option.value"
                            class="radio-option">
                            {{ option.label }}
                          </mat-radio-button>
                        </mat-radio-group>
                        <div *ngIf="field.description" class="field-description">{{ field.description }}</div>
                      </div>

                      <!-- Date Picker -->
                      <mat-form-field 
                        *ngIf="field.type === 'date'"
                        appearance="outline" 
                        class="form-field">
                        <mat-label>{{ field.label }}</mat-label>
                        <input 
                          matInput 
                          [matDatepicker]="picker"
                          [formControlName]="field.key"
                          [readonly]="field.disabled">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                        <mat-hint *ngIf="field.description">{{ field.description }}</mat-hint>
                        <mat-error *ngIf="getFieldError(i, field.key)">
                          {{ getFieldError(i, field.key) }}
                        </mat-error>
                      </mat-form-field>

                      <!-- Slider -->
                      <div *ngIf="field.type === 'slider'" class="form-field slider-field">
                        <label class="field-label">{{ field.label }}: {{ dynamicForms[i].get(field.key)?.value }}</label>
                        <mat-slider 
                          [min]="field.min || 0"
                          [max]="field.max || 100"
                          [step]="field.step || 1"
                          [disabled]="field.disabled"
                          class="slider">
                          <input matSliderThumb [formControlName]="field.key">
                        </mat-slider>
                        <div *ngIf="field.description" class="field-description">{{ field.description }}</div>
                      </div>

                      <!-- Toggle Switch -->
                      <div *ngIf="field.type === 'toggle'" class="form-field toggle-field">
                        <mat-slide-toggle 
                          [formControlName]="field.key"
                          [disabled]="field.disabled">
                          {{ field.label }}
                        </mat-slide-toggle>
                        <div *ngIf="field.description" class="field-description">{{ field.description }}</div>
                      </div>

                      <!-- Chips -->
                      <div *ngIf="field.type === 'chips'" class="form-field chips-field full-width">
                        <label class="field-label">{{ field.label }}</label>
                        <mat-chip-listbox class="chip-list" [formControlName]="field.key">
                          <mat-chip-option 
                            *ngFor="let option of field.options" 
                            [value]="option.value"
                            [disabled]="field.disabled">
                            {{ option.label }}
                          </mat-chip-option>
                        </mat-chip-listbox>
                        <div *ngIf="field.description" class="field-description">{{ field.description }}</div>
                      </div>
                    </ng-container>
                  </div>

                  <!-- Form Actions -->
                  <div class="form-actions">
                    <button 
                      mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="!dynamicForms[i].valid"
                      class="submit-button">
                      <mat-icon>send</mat-icon>
                      Submit Form
                    </button>
                    <button 
                      mat-stroked-button 
                      type="button"
                      (click)="resetForm(i)"
                      class="reset-button">
                      <mat-icon>refresh</mat-icon>
                      Reset
                    </button>
                    <button 
                      mat-button 
                      type="button"
                      (click)="showFormData(i)"
                      class="preview-button">
                      <mat-icon>visibility</mat-icon>
                      Preview Data
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .forms-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .forms-header {
      margin-bottom: 32px;
    }

    .forms-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text-primary);
    }

    .title-icon {
      color: #3b82f6;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .forms-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .form-tabs {
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .form-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .dynamic-form {
      margin-top: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .form-field {
      width: 100%;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .checkbox-field,
    .toggle-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-field {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .field-label {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-bottom: 8px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-option {
      margin-bottom: 8px;
    }

    .slider-field {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .slider {
      width: 100%;
    }

    .chips-field {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .field-description {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
    }

    .submit-button,
    .reset-button,
    .preview-button {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .forms-title {
        font-size: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
        gap: 12px;
      }

      .submit-button,
      .reset-button,
      .preview-button {
        width: 100%;
        justify-content: center;
      }
    }

    /* Animation */
    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class DynamicFormsComponent implements OnInit {
  selectedTabIndex = 0;
  dynamicForms: FormGroup[] = [];

  formConfigs: DynamicFormConfig[] = [
    {
      title: 'User Registration',
      description: 'Create a new user account with personal information',
      fields: [
        {
          key: 'firstName',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          validators: [Validators.required, Validators.minLength(2)]
        },
        {
          key: 'lastName',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          validators: [Validators.required, Validators.minLength(2)]
        },
        {
          key: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          validators: [Validators.required, Validators.email]
        },
        {
          key: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter a secure password',
          required: true,
          validators: [Validators.required, Validators.minLength(8)]
        },
        {
          key: 'age',
          type: 'number',
          label: 'Age',
          placeholder: 'Enter your age',
          min: 18,
          max: 100,
          validators: [Validators.min(18), Validators.max(100)]
        },
        {
          key: 'country',
          type: 'select',
          label: 'Country',
          required: true,
          options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' },
            { value: 'de', label: 'Germany' }
          ]
        },
        {
          key: 'interests',
          type: 'multiselect',
          label: 'Interests',
          description: 'Select multiple interests',
          options: [
            { value: 'tech', label: 'Technology' },
            { value: 'sports', label: 'Sports' },
            { value: 'music', label: 'Music' },
            { value: 'travel', label: 'Travel' },
            { value: 'cooking', label: 'Cooking' }
          ]
        },
        {
          key: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to newsletter',
          description: 'Receive updates and promotional emails'
        },
        {
          key: 'bio',
          type: 'textarea',
          label: 'Biography',
          placeholder: 'Tell us about yourself...',
          rows: 4,
          description: 'Optional personal description'
        }
      ]
    },
    {
      title: 'Product Feedback',
      description: 'Share your experience with our products',
      fields: [
        {
          key: 'productName',
          type: 'select',
          label: 'Product',
          required: true,
          options: [
            { value: 'laptop', label: 'Laptop Computer' },
            { value: 'smartphone', label: 'Smartphone' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'headphones', label: 'Headphones' },
            { value: 'smartwatch', label: 'Smart Watch' }
          ]
        },
        {
          key: 'rating',
          type: 'slider',
          label: 'Overall Rating',
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 5,
          description: 'Rate from 1 (poor) to 10 (excellent)'
        },
        {
          key: 'usageFrequency',
          type: 'radio',
          label: 'How often do you use this product?',
          required: true,
          options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'rarely', label: 'Rarely' }
          ]
        },
        {
          key: 'features',
          type: 'chips',
          label: 'Favorite Features',
          description: 'Select all features you like',
          options: [
            { value: 'performance', label: 'Performance' },
            { value: 'design', label: 'Design' },
            { value: 'battery', label: 'Battery Life' },
            { value: 'camera', label: 'Camera Quality' },
            { value: 'display', label: 'Display' },
            { value: 'audio', label: 'Audio Quality' }
          ]
        },
        {
          key: 'purchaseDate',
          type: 'date',
          label: 'Purchase Date',
          required: true
        },
        {
          key: 'recommend',
          type: 'toggle',
          label: 'Would you recommend this product?',
          defaultValue: true
        },
        {
          key: 'comments',
          type: 'textarea',
          label: 'Additional Comments',
          placeholder: 'Share your detailed feedback...',
          rows: 5,
          description: 'Any additional thoughts or suggestions'
        }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeForms();
  }

  private initializeForms() {
    this.dynamicForms = this.formConfigs.map(config => {
      const group: any = {};
      
      config.fields.forEach(field => {
        const validators = field.validators || [];
        if (field.required) {
          validators.push(Validators.required);
        }
        
        group[field.key] = new FormControl({
          value: field.defaultValue || null,
          disabled: field.disabled || false
        }, validators);
      });

      return this.fb.group(group);
    });
  }

  getFieldError(formIndex: number, fieldKey: string): string | null {
    const field = this.dynamicForms[formIndex].get(fieldKey);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors?.['min']) {
        return `Minimum value is ${field.errors['min'].min}`;
      }
      if (field.errors?.['max']) {
        return `Maximum value is ${field.errors['max'].max}`;
      }
    }
    return null;
  }

  onSubmit(formIndex: number) {
    const form = this.dynamicForms[formIndex];
    if (form.valid) {
      const formData = form.value;
      console.log('Form submitted:', formData);
      
      this.snackBar.open(
        `${this.formConfigs[formIndex].title} submitted successfully!`, 
        'Close',
        { duration: 3000, panelClass: ['success-snackbar'] }
      );
    } else {
      this.snackBar.open(
        'Please fill in all required fields correctly', 
        'Close',
        { duration: 3000, panelClass: ['error-snackbar'] }
      );
    }
  }

  resetForm(formIndex: number) {
    this.dynamicForms[formIndex].reset();
    
    // Reset to default values
    this.formConfigs[formIndex].fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.dynamicForms[formIndex].get(field.key)?.setValue(field.defaultValue);
      }
    });

    this.snackBar.open('Form reset successfully', 'Close', { duration: 2000 });
  }

  showFormData(formIndex: number) {
    const formData = this.dynamicForms[formIndex].value;
    console.log('Current form data:', formData);
    
    this.snackBar.open(
      'Form data logged to console', 
      'Close',
      { duration: 2000 }
    );
  }
}