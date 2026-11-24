import { Injectable, computed, signal } from '@angular/core';

import { Produto } from '../models/produto';
import { MOCK_PRODUTOS } from '../mocks/mock-produtos';

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
  private readonly lista = signal<Produto[]>(MOCK_PRODUTOS.map((p) => ({ ...p })));

  readonly produtos = this.lista.asReadonly();

  readonly nextId = computed(() => Math.max(0, ...this.lista().map((p) => p.id)) + 1);

  getById(id: number): Produto | undefined {
    return this.lista().find((p) => p.id === id);
  }

  add(data: ProdutoInput): Produto {
    const id = this.nextId();
    const produto: Produto = {
      id,
      codigo: `SKU-${String(id).padStart(3, '0')}`,
      unidade: 'Unidade',
      ativo: true,
      ...this.clean(data),
    };
    this.lista.update((list) => [...list, produto]);
    return produto;
  }

  update(id: number, data: ProdutoInput): Produto | undefined {
    let updated: Produto | undefined;
    this.lista.update((list) =>
      list.map((p) => (p.id === id ? (updated = { ...p, ...this.clean(data) }) : p)),
    );
    return updated;
  }

  /** Adiciona (entrada) ou retira (saída) unidades de um produto. */
  movimentar(id: number, tipo: TipoMovimento, quantidade: number): Produto | undefined {
    let updated: Produto | undefined;
    const delta = tipo === 'entrada' ? quantidade : -quantidade;
    this.lista.update((list) =>
      list.map((p) =>
        p.id === id ? (updated = { ...p, quantidade: Math.max(0, p.quantidade + delta) }) : p,
      ),
    );
    return updated;
  }

  situacao(produto: Produto): Situacao {
    if (produto.quantidade <= 0) {
      return 'sem-estoque';
    }
    return produto.quantidade <= produto.estoqueMinimo ? 'estoque-baixo' : 'em-estoque';
  }

  private clean(data: ProdutoInput): ProdutoInput {
    return { ...data, nome: data.nome.trim(), categoria: data.categoria.trim() };
  }
}
