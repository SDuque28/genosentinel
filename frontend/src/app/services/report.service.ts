import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneticVariant } from './variant.service';

export interface PatientData {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  status: string;
}

export interface PatientReport {
  id: string;
  patient_id: string;
  patient_data: PatientData;
  variant: string;
  variant_details: GeneticVariant;
  detection_date: string;
  allele_frequency: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateReport {
  patient_id: string;
  variant: string;
  detection_date: string;
  allele_frequency: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = '/genosentinel/genomic/reports';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PatientReport[]> {
    return this.http.get<PatientReport[]>(this.baseUrl);
  }

  getById(id: string): Observable<PatientReport> {
    return this.http.get<PatientReport>(`${this.baseUrl}/${id}`);
  }

  create(report: CreateReport): Observable<PatientReport> {
    return this.http.post<PatientReport>(this.baseUrl, report);
  }

  update(id: string, report: Partial<CreateReport>): Observable<PatientReport> {
    return this.http.patch<PatientReport>(`${this.baseUrl}/${id}`, report);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}