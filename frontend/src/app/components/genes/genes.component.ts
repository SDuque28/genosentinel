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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GeneService, Gene, CreateGene } from '../../services/gene.service';

@Component({
  selector: 'app-genes',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './genes.component.html',
  styleUrls: ['./genes.component.css']
})
export class GenesComponent implements OnInit {
  genes: Gene[] = [];
  displayedColumns: string[] = ['id', 'symbol', 'full_name', 'actions'];
  showForm = false;
  editMode = false;
  loading = false;
  currentGene: CreateGene = {
    symbol: '',
    full_name: '',
    function_summary: ''
  };
  editId: number | null = null;

  constructor(
    private geneService: GeneService,
    private snackBar: MatSnackBar
  ) {
    console.log('GenesComponent constructor called');
  }

  ngOnInit(): void {
    console.log('GenesComponent ngOnInit called');
    this.loadGenes();
  }

  loadGenes(): void {
    console.log('Loading genes...');
    this.loading = true;
    this.geneService.getAll().subscribe({
      next: (data) => {
        console.log('Genes loaded:', data);
        this.genes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading genes:', error);
        this.snackBar.open('Error loading genes: ' + error.message, 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentGene = {
      symbol: '',
      full_name: '',
      function_summary: ''
    };
  }

  editGene(gene: Gene): void {
    this.showForm = true;
    this.editMode = true;
    this.editId = gene.id;
    this.currentGene = {
      symbol: gene.symbol,
      full_name: gene.full_name,
      function_summary: gene.function_summary
    };
  }

  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.editId = null;
  }

  saveGene(): void {
    if (this.editMode && this.editId !== null) {
      this.geneService.update(this.editId, this.currentGene).subscribe({
        next: () => {
          this.snackBar.open('Gene updated successfully', 'Close', { duration: 3000 });
          this.loadGenes();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating gene:', error);
          this.snackBar.open('Error updating gene: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.geneService.create(this.currentGene).subscribe({
        next: () => {
          this.snackBar.open('Gene created successfully', 'Close', { duration: 3000 });
          this.loadGenes();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating gene:', error);
          this.snackBar.open('Error creating gene: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  deleteGene(id: number): void {
    if (confirm('Are you sure you want to delete this gene?')) {
      this.geneService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Gene deleted successfully', 'Close', { duration: 3000 });
          this.loadGenes();
        },
        error: (error) => {
          console.error('Error deleting gene:', error);
          this.snackBar.open('Error deleting gene: ' + error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }
}