import { Injectable, computed, signal } from '@angular/core';

import { Estoque } from '../models/estoque';
import { MOCK_ESTOQUES } from '../mocks/mock-estoques';

/** Dados informados pelo usuário ao criar/editar um estoque (sem o id). */
export type EstoqueInput = Omit<Estoque, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  /** Cópia da lista mock, mantida em memória enquanto a aplicação está aberta. */
  private readonly lista = signal<Estoque[]>(MOCK_ESTOQUES.map((estoque) => ({ ...estoque })));

  /** Lista completa de estoques (somente leitura para os componentes). */
  readonly estoques = this.lista.asReadonly();

  /** Termo digitado no campo de pesquisa da barra superior. */
  readonly searchTerm = signal('');

  /** Estoques que correspondem ao termo de pesquisa atual. */
  readonly filteredEstoques = computed(() => this.filter(this.lista(), this.searchTerm()));

  /** Próximo id que será atribuído automaticamente. */
  readonly nextId = computed(() => Math.max(0, ...this.lista().map((e) => e.id)) + 1);

  getById(id: number): Estoque | undefined {
    return this.lista().find((estoque) => estoque.id === id);
  }

  add(data: EstoqueInput): Estoque {
    const estoque: Estoque = { id: this.nextId(), ...this.clean(data) };
    this.lista.update((list) => [...list, estoque]);
    return estoque;
  }

  update(id: number, data: EstoqueInput): Estoque | undefined {
    let updated: Estoque | undefined;
    this.lista.update((list) =>
      list.map((e) => (e.id === id ? (updated = { ...e, ...this.clean(data) }) : e)),
    );
    return updated;
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  /** Filtra os estoques pelo id, nome, endereço, cidade ou telefone. */
  private filter(estoques: Estoque[], term: string): Estoque[] {
    const query = term.trim().toLowerCase();
    if (!query) {
      return estoques;
    }
    return estoques.filter(
      (e) =>
        String(e.id) === query.replace('#', '') ||
        [e.nome, e.endereco, e.cidade, e.telefone].some((v) => v.toLowerCase().includes(query)),
    );
  }

  private clean(data: EstoqueInput): EstoqueInput {
    return {
      nome: data.nome.trim(),
      endereco: data.endereco.trim(),
      cidade: data.cidade.trim(),
      telefone: data.telefone.trim(),
    };
  }
}
