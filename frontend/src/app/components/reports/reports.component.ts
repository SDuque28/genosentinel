import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReportService, PatientReport, CreateReport } from '../../services/report.service';
import { VariantService, GeneticVariant } from '../../services/variant.service';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: PatientReport[] = [];
  variants: GeneticVariant[] = [];
  patients: Patient[] = [];
  displayedColumns: string[] = ['patient', 'variant', 'detection_date', 'allele_frequency', 'actions'];
  showForm = false;
  editMode = false;
  currentReport: CreateReport = {
    patient_id: '',
    variant: '',
    detection_date: '',
    allele_frequency: 0
  };
  editId: string | null = null;

  constructor(
    private reportService: ReportService,
    private variantService: VariantService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadVariants();
    this.loadPatients();
  }

  loadReports(): void {
    this.reportService.getAll().subscribe({
      next: (data) => {
        this.reports = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading reports', 'Close', { duration: 3000 });
      }
    });
  }

  loadVariants(): void {
    this.variantService.getAll().subscribe({
      next: (data) => {
        this.variants = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading variants', 'Close', { duration: 3000 });
      }
    });
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading patients', 'Close', { duration: 3000 });
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentReport = {
      patient_id: '',
      variant: '',
      detection_date: '',
      allele_frequency: 0
    };
  }

  editReport(report: PatientReport): void {
    this.showForm = true;
    this.editMode = true;
    this.editId = report.id;
    this.currentReport = {
      patient_id: report.patient_id,
      variant: report.variant,
      detection_date: report.detection_date,
      allele_frequency: report.allele_frequency
    };
  }

  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.editId = null;
  }

  saveReport(): void {
    if (this.editMode && this.editId !== null) {
      this.reportService.update(this.editId, this.currentReport).subscribe({
        next: () => {
          this.snackBar.open('Report updated successfully', 'Close', { duration: 3000 });
          this.loadReports();
          this.cancelForm();
        },
        error: (error) => {
          this.snackBar.open('Error updating report: ' + (error.error?.detail || error.message), 'Close', { duration: 5000 });
        }
      });
    } else {
      this.reportService.create(this.currentReport).subscribe({
        next: () => {
          this.snackBar.open('Report created successfully', 'Close', { duration: 3000 });
          this.loadReports();
          this.cancelForm();
        },
        error: (error) => {
          this.snackBar.open('Error creating report: ' + (error.error?.detail || error.message), 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Report deleted successfully', 'Close', { duration: 3000 });
          this.loadReports();
        },
        error: (error) => {
          this.snackBar.open('Error deleting report', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getPatientName(report: PatientReport): string {
    if (report.patient_data) {
      return `${report.patient_data.first_name} ${report.patient_data.last_name}`;
    }
    return report.patient_id;
  }

  getVariantInfo(report: PatientReport): string {
    if (report.variant_details && report.variant_details.gene_details) {
      return `${report.variant_details.gene_details.symbol} - ${report.variant_details.chromosome}:${report.variant_details.position}`;
    }
    return report.variant;
  }
}