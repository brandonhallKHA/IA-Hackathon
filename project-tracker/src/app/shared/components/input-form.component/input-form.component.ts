import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

type YesNo = 'Yes' | 'No';

@Component({
  selector: 'app-project-info-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: 'input-form.component.html',
  styles: [`
    .container {
      display: grid;
      gap: 1rem;
      padding: 1rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .card { border-radius: 1rem; }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    .col-span-2 { grid-column: span 2; }
    .actions {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem 1rem;
    }
    .spacer { flex: 1; }
    .preview { border-radius: 1rem; }
    @media (max-width: 800px) {
      .grid { grid-template-columns: 1fr; }
      .col-span-2 { grid-column: auto; }
    }
  `]
})
export class ProjectInfoFormComponent {
  projectTypes: string[] = [
    'Gas Main', 'Service Line', 'Station', 'Crossing', 'Relocation', 'Maintenance', 'Other'
  ];

  services: string[] = [
    'Design', 'Survey', 'Permitting', 'Construction Support', 'As-Built', 'PM', 'Other'
  ];

  months = [
    { label: 'Jan', value: 1 }, { label: 'Feb', value: 2 }, { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 }, { label: 'May', value: 5 }, { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 }, { label: 'Aug', value: 8 }, { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 }, { label: 'Nov', value: 11 }, { label: 'Dec', value: 12 }
  ];

  form: FormGroup;
  private _submitted = signal(false);
  submitted = computed(() => this._submitted());

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      // Top-level meta
      projectType: ['', Validators.required],
      engineeringNumber: ['', Validators.required],
      wo: [''],
      town: [''],
      projectLead: ['', Validators.required],
      service: [''],
      sheets: [0, [Validators.min(0)]],

      // Dates
      anticipatedNtp: [null as Date | null],
      ntp: [null as Date | null],
      expectedCompletion: [null as Date | null],
      deliverablesReceived: [null as Date | null],
      debrief: [null as Date | null],

      // Misc
      contractorSelected: [''],
      scopeNotes: [''],
      lgDrawing: ['No' as YesNo],
      khBillingNumber: [''],
      anticipatedFee: [0, [Validators.min(0)]],
      anticipatedNicorReportMonth: [null as null | { month: number; year: number }],
      billedReportedNicor: ['No' as YesNo],
    });
  }

  nicorYears(): number[] {
    const now = new Date();
    const y = now.getFullYear();
    return [y - 1, y, y + 1];
  }

  reset(): void {
    this.form.reset({
      sheets: 0,
      lgDrawing: 'No',
      anticipatedFee: 0,
      billedReportedNicor: 'No'
    });
    this._submitted.set(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    // TODO: Replace with service call or output event as needed
    this._submitted.set(true);
    // console.log('Payload', this.form.value);
  }
}
