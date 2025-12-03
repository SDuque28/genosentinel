import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gene } from './gene.service';

export interface GeneticVariant {
  id: string;
  gene: number;
  gene_details: Gene;
  chromosome: string;
  position: number;
  reference_base: string;
  alternate_base: string;
  impact: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVariant {
  gene: number;
  chromosome: string;
  position: number;
  reference_base: string;
  alternate_base: string;
  impact: string;
}

@Injectable({
  providedIn: 'root'
})
export class VariantService {
  private baseUrl = '/genosentinel/genomic/variants';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GeneticVariant[]> {
    return this.http.get<GeneticVariant[]>(this.baseUrl);
  }

  getById(id: string): Observable<GeneticVariant> {
    return this.http.get<GeneticVariant>(`${this.baseUrl}/${id}`);
  }

  create(variant: CreateVariant): Observable<GeneticVariant> {
    return this.http.post<GeneticVariant>(this.baseUrl, variant);
  }

  update(id: string, variant: Partial<CreateVariant>): Observable<GeneticVariant> {
    return this.http.patch<GeneticVariant>(`${this.baseUrl}/${id}`, variant);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}