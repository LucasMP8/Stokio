import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  private readonly fb = inject(FormBuilder);

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
  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(40)]],
    endereco: ['', [Validators.required, Validators.maxLength(100)]],
    cidade: ['', [Validators.required, Validators.maxLength(40)]],
    telefone: ['', [Validators.required, Validators.pattern(/^[\d\s()+-]{8,20}$/)]],
  });

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.erroSalvar.set(null);
    this.isFormOpen.set(true);
  }

  openEdit(estoque: Estoque, event?: Event): void {
    event?.stopPropagation();
    this.editingId.set(estoque.id);
    const { id, ...dados } = estoque;
    this.form.reset(dados);
    this.erroSalvar.set(null);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingId.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.editingId();
    const dados: EstoqueInput = this.form.getRawValue();
    const requisicao =
      id === null ? this.estoqueService.add(dados) : this.estoqueService.update(id, dados);

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

  invalido(campo: keyof EstoqueInput): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }
}
