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
import { VariantService, GeneticVariant, CreateVariant } from '../../services/variant.service';
import { GeneService, Gene } from '../../services/gene.service';

@Component({
  selector: 'app-variants',
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
    MatSelectModule
  ],
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.css']
})
export class VariantsComponent implements OnInit {
  variants: GeneticVariant[] = [];
  genes: Gene[] = [];
  displayedColumns: string[] = ['gene', 'chromosome', 'position', 'impact', 'actions'];
  showForm = false;
  editMode = false;
  currentVariant: CreateVariant = {
    gene: 0,
    chromosome: '',
    position: 0,
    reference_base: '',
    alternate_base: '',
    impact: ''
  };
  editId: string | null = null;

  impactTypes = [
    'MISSENSE',
    'NONSENSE',
    'FRAMESHIFT',
    'SILENT',
    'SPLICE_SITE',
    'INFRAME_INSERTION',
    'INFRAME_DELETION'
  ];

  constructor(
    private variantService: VariantService,
    private geneService: GeneService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVariants();
    this.loadGenes();
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

  loadGenes(): void {
    this.geneService.getAll().subscribe({
      next: (data) => {
        this.genes = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading genes', 'Close', { duration: 3000 });
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentVariant = {
      gene: 0,
      chromosome: '',
      position: 0,
      reference_base: '',
      alternate_base: '',
      impact: ''
    };
  }

  editVariant(variant: GeneticVariant): void {
    this.showForm = true;
    this.editMode = true;
    this.editId = variant.id;
    this.currentVariant = {
      gene: variant.gene,
      chromosome: variant.chromosome,
      position: variant.position,
      reference_base: variant.reference_base,
      alternate_base: variant.alternate_base,
      impact: variant.impact
    };
  }

  cancelForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.editId = null;
  }

  saveVariant(): void {
    if (this.editMode && this.editId !== null) {
      this.variantService.update(this.editId, this.currentVariant).subscribe({
        next: () => {
          this.snackBar.open('Variant updated successfully', 'Close', { duration: 3000 });
          this.loadVariants();
          this.cancelForm();
        },
        error: (error) => {
          this.snackBar.open('Error updating variant', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.variantService.create(this.currentVariant).subscribe({
        next: () => {
          this.snackBar.open('Variant created successfully', 'Close', { duration: 3000 });
          this.loadVariants();
          this.cancelForm();
        },
        error: (error) => {
          this.snackBar.open('Error creating variant', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteVariant(id: string): void {
    if (confirm('Are you sure you want to delete this variant?')) {
      this.variantService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Variant deleted successfully', 'Close', { duration: 3000 });
          this.loadVariants();
        },
        error: (error) => {
          this.snackBar.open('Error deleting variant', 'Close', { duration: 3000 });
        }
      });
    }
  }
}