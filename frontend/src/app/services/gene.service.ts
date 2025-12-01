import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Gene {
  id: number;
  symbol: string;
  full_name: string;
  function_summary: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGene {
  symbol: string;
  full_name: string;
  function_summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneService {
  private baseUrl = '/genosentinel/genomic/genes';

  constructor(private http: HttpClient) {
    console.log('GeneService initialized');
  }

  getAll(): Observable<Gene[]> {
    console.log('GeneService: Fetching all genes');
    return this.http.get<Gene[]>(this.baseUrl).pipe(
      tap(data => console.log('GeneService: Received', data.length, 'genes'))
    );
  }

  getById(id: number): Observable<Gene> {
    return this.http.get<Gene>(`${this.baseUrl}/${id}`);
  }

  create(gene: CreateGene): Observable<Gene> {
    console.log('GeneService: Creating gene:', gene);
    return this.http.post<Gene>(this.baseUrl, gene).pipe(
      tap(data => console.log('GeneService: Gene created:', data))
    );
  }

  update(id: number, gene: Partial<CreateGene>): Observable<Gene> {
    return this.http.patch<Gene>(`${this.baseUrl}/${id}`, gene);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}