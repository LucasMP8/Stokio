import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, throwError } from 'rxjs';

import { API_URL } from '../api';
import { Produto } from '../models/produto';

export type Situacao = 'em-estoque' | 'estoque-baixo' | 'sem-estoque';

export type TipoMovimento = 'entrada' | 'saida';

/** Campos informados no formulário; código, unidade e ativo são definidos pelo service. */
export type ProdutoInput = Pick<
  Produto,
  'nome' | 'categoria' | 'precoCusto' | 'precoVenda' | 'quantidade' | 'estoqueMinimo' | 'estoqueId'
>;

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/produtos`;

  /** Cópia local dos produtos retornados pela API. */
  private readonly lista = signal<Produto[]>([]);

  readonly produtos = this.lista.asReadonly();
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  /** Próximo id (o JSON-Server gera o maior id + 1). */
  readonly nextId = computed(() => Math.max(0, ...this.lista().map((p) => p.id)) + 1);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.carregar();
    }
  }

  carregar(): void {
    this.carregando.set(true);
    this.http.get<Produto[]>(this.url).subscribe({
      next: (produtos) => {
        this.lista.set(produtos);
        this.erro.set(null);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os produtos. Verifique se a API está rodando.');
        this.carregando.set(false);
      },
    });
  }

  getById(id: number): Produto | undefined {
    return this.lista().find((p) => p.id === id);
  }

  add(data: ProdutoInput): Observable<Produto> {
    const novo: Omit<Produto, 'id'> = {
      codigo: `SKU-${String(this.nextId()).padStart(3, '0')}`,
      unidade: 'Unidade',
      ativo: true,
      ...this.clean(data),
    };
    return this.http
      .post<Produto>(this.url, novo)
      .pipe(tap((produto) => this.lista.update((list) => [...list, produto])));
  }

  update(id: number, data: ProdutoInput): Observable<Produto> {
    return this.http
      .patch<Produto>(`${this.url}/${id}`, this.clean(data))
      .pipe(tap((produto) => this.substituir(produto)));
  }

  remove(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(tap(() => this.lista.update((list) => list.filter((p) => p.id !== id))));
  }

  /** Adiciona (entrada) ou retira (saída) unidades, sem deixar o saldo negativo. */
  movimentar(id: number, tipo: TipoMovimento, quantidade: number): Observable<Produto> {
    const produto = this.getById(id);
    if (!produto) {
      return throwError(() => new Error('Produto não encontrado.'));
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return throwError(() => new Error('A quantidade deve ser um número inteiro maior que zero.'));
    }
    if (tipo === 'saida' && quantidade > produto.quantidade) {
      return throwError(() => new Error('Não é possível retirar mais do que o saldo disponível.'));
    }

    const novaQuantidade =
      tipo === 'entrada' ? produto.quantidade + quantidade : produto.quantidade - quantidade;
    return this.http
      .patch<Produto>(`${this.url}/${id}`, { quantidade: novaQuantidade })
      .pipe(tap((atualizado) => this.substituir(atualizado)));
  }

  situacao(produto: Produto): Situacao {
    if (produto.quantidade <= 0) {
      return 'sem-estoque';
    }
    return produto.quantidade <= produto.estoqueMinimo ? 'estoque-baixo' : 'em-estoque';
  }

  private substituir(produto: Produto): void {
    this.lista.update((list) => list.map((p) => (p.id === produto.id ? produto : p)));
  }

  private clean(data: ProdutoInput): ProdutoInput {
    return { ...data, nome: data.nome.trim(), categoria: data.categoria.trim() };
  }
}
