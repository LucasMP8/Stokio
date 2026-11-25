import { Component, HostListener, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Estoque } from '../../models/estoque';
import { EstoqueInput, EstoqueService } from '../../services/estoque.service';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory {
  private readonly estoqueService = inject(EstoqueService);
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  protected readonly estoques = this.estoqueService.filteredEstoques;
  protected readonly searchTerm = this.estoqueService.searchTerm;
  protected readonly nextId = this.estoqueService.nextId;
  protected readonly carregando = this.estoqueService.carregando;
  protected readonly erroCarregar = this.estoqueService.erro;

  /** Controle do formulário (modal) de criação/edição. */
  protected readonly isFormOpen = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly salvando = signal(false);
  protected readonly erroSalvar = signal<string | null>(null);
  protected form: EstoqueInput = this.emptyForm();

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.erroSalvar.set(null);
    this.isFormOpen.set(true);
  }

  openEdit(estoque: Estoque, event?: Event): void {
    event?.stopPropagation();
    this.editingId.set(estoque.id);
    const { id, ...dados } = estoque;
    this.form = dados;
    this.erroSalvar.set(null);
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
    const requisicao =
      id === null ? this.estoqueService.add(this.form) : this.estoqueService.update(id, this.form);

    this.salvando.set(true);
    this.erroSalvar.set(null);
    requisicao.subscribe({
      next: () => {
        this.salvando.set(false);
        this.closeForm();
      },
      error: () => {
        this.salvando.set(false);
        this.erroSalvar.set('Não foi possível salvar. Verifique se a API está rodando.');
      },
    });
  }

  excluir(): void {
    const id = this.editingId();
    const estoque = id === null ? undefined : this.estoqueService.getById(id);
    if (!estoque) {
      return;
    }
    if (this.produtoService.possuiProdutosNoEstoque(estoque.id)) {
      this.erroSalvar.set('Não é possível excluir um estoque que ainda possui produtos.');
      return;
    }
    if (!confirm(`Excluir o estoque "${estoque.nome}"?`)) {
      return;
    }
    this.salvando.set(true);
    this.erroSalvar.set(null);
    this.estoqueService.remove(estoque.id).subscribe({
      next: () => {
        this.salvando.set(false);
        this.closeForm();
      },
      error: () => {
        this.salvando.set(false);
        this.erroSalvar.set('Não foi possível excluir. Verifique se a API está rodando.');
      },
    });
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
