import { Component, HostListener, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Produto } from '../../models/produto';
import { ProdutoService, TipoMovimento } from '../../services/produto.service';

@Component({
  selector: 'app-registro-movimento',
  standalone: false,
  templateUrl: './registro-movimento.html',
  styleUrl: './registro-movimento.css',
})
export class RegistroMovimento {
  private readonly produtoService = inject(ProdutoService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly produtos = this.produtoService.produtos;

  protected readonly hoje = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  protected readonly selecionado = signal<Produto | null>(null);
  protected readonly salvando = signal(false);
  protected readonly erroSalvar = signal<string | null>(null);
  protected readonly carregando = this.produtoService.carregando;
  protected readonly erroCarregar = this.produtoService.erro;

  protected readonly form = this.fb.group(
    {
      tipo: this.fb.nonNullable.control<TipoMovimento>('entrada', Validators.required),
      quantidade: this.fb.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+$/),
      ]),
    },
    { validators: (grupo) => this.saidaMaiorQueEstoque(grupo) },
  );

  irParaInventario(): void {
    this.router.navigate(['/inventory']);
  }

  formatarQuantidade(quantidade: number, unidade: string): string {
    const base = unidade.toLowerCase();
    return `${quantidade} ${quantidade === 1 ? base : `${base}s`}`;
  }

  abaixoDoMinimo(produto: Produto): boolean {
    return produto.quantidade <= produto.estoqueMinimo;
  }

  abrirMovimento(produto: Produto): void {
    this.erroSalvar.set(null);
    this.selecionado.set(produto);
    this.form.reset({ tipo: 'entrada', quantidade: null });
  }

  fechar(): void {
    this.selecionado.set(null);
  }

  novaQuantidade(): number | null {
    const produto = this.selecionado();
    const { tipo, quantidade } = this.form.getRawValue();
    if (!produto || this.form.invalid || quantidade === null) {
      return null;
    }
    return tipo === 'entrada' ? produto.quantidade + quantidade : produto.quantidade - quantidade;
  }

  confirmar(): void {
    const produto = this.selecionado();
    if (!produto) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { tipo, quantidade } = this.form.getRawValue();
    this.salvando.set(true);
    this.erroSalvar.set(null);
    this.produtoService.movimentar(produto.id, tipo, Number(quantidade)).subscribe({
      next: () => {
        this.salvando.set(false);
        this.fechar();
      },
      error: (erro: unknown) => {
        this.salvando.set(false);
        this.erroSalvar.set(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível registrar. Verifique se a API está rodando.',
        );
      },
    });
  }

  quantidadeInvalida(): boolean {
    const campo = this.form.controls.quantidade;
    return campo.invalid && campo.touched;
  }

  saidaInvalida(): boolean {
    return this.form.hasError('saidaMaiorQueEstoque') && this.form.controls.quantidade.touched;
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.selecionado()) {
      this.fechar();
    }
  }

  private saidaMaiorQueEstoque(grupo: AbstractControl): ValidationErrors | null {
    const produto = this.selecionado?.();
    const { tipo, quantidade } = grupo.value as { tipo: TipoMovimento; quantidade: number | null };
    if (produto && tipo === 'saida' && quantidade !== null && quantidade > produto.quantidade) {
      return { saidaMaiorQueEstoque: true };
    }
    return null;
  }
}
