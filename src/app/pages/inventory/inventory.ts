import { Component, HostListener, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Estoque } from '../../models/estoque';
import { EstoqueInput, EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  private readonly estoqueService = inject(EstoqueService);
  private readonly router = inject(Router);

  protected readonly estoques = this.estoqueService.filteredEstoques;
  protected readonly searchTerm = this.estoqueService.searchTerm;
  protected readonly nextId = this.estoqueService.nextId;

  /** Controle do formulário (modal) de criação/edição. */
  protected readonly isFormOpen = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected form: EstoqueInput = this.emptyForm();

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.isFormOpen.set(true);
  }

  openEdit(estoque: Estoque, event?: Event): void {
    event?.stopPropagation();
    this.editingId.set(estoque.id);
    const { id, ...dados } = estoque;
    this.form = dados;
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingId.set(null);
  }

  save(ngForm: NgForm): void {
    if (ngForm.invalid) {
      ngForm.control.markAllAsTouched();
      return;
    }

    const id = this.editingId();
    if (id === null) {
      this.estoqueService.add(this.form);
    } else {
      this.estoqueService.update(id, this.form);
    }
    this.closeForm();
  }

  viewDetails(estoque: Estoque): void {
    this.router.navigate(['/inventory', estoque.id]);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isFormOpen()) {
      this.closeForm();
    }
  }

  private emptyForm(): EstoqueInput {
    return { nome: '', endereco: '', cidade: '', telefone: '' };
  }
}
