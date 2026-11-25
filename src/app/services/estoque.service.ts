import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { API_URL } from '../api';
import { Estoque } from '../models/estoque';

/** Dados informados pelo usuário ao criar/editar um estoque (sem o id). */
export type EstoqueInput = Omit<Estoque, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/estoques`;

  /** Cópia local dos estoques retornados pela API. */
  private readonly lista = signal<Estoque[]>([]);

  readonly estoques = this.lista.asReadonly();
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  /** Termo digitado no campo de pesquisa da barra superior. */
  readonly searchTerm = signal('');

  /** Estoques que correspondem ao termo de pesquisa atual. */
  readonly filteredEstoques = computed(() => this.filter(this.lista(), this.searchTerm()));

  /** Próximo id (o JSON-Server gera o maior id + 1). */
  readonly nextId = computed(() => Math.max(0, ...this.lista().map((e) => e.id)) + 1);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.carregar();
    }
  }

  carregar(): void {
    this.carregando.set(true);
    this.http.get<Estoque[]>(this.url).subscribe({
      next: (estoques) => {
        this.lista.set(estoques);
        this.erro.set(null);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os estoques. Verifique se a API está rodando.');
        this.carregando.set(false);
      },
    });
  }

  getById(id: number): Estoque | undefined {
    return this.lista().find((estoque) => estoque.id === id);
  }

  add(data: EstoqueInput): Observable<Estoque> {
    return this.http
      .post<Estoque>(this.url, this.clean(data))
      .pipe(tap((estoque) => this.lista.update((list) => [...list, estoque])));
  }

  update(id: number, data: EstoqueInput): Observable<Estoque> {
    return this.http
      .put<Estoque>(`${this.url}/${id}`, { id, ...this.clean(data) })
      .pipe(
        tap((estoque) => this.lista.update((list) => list.map((e) => (e.id === id ? estoque : e)))),
      );
  }

  remove(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(tap(() => this.lista.update((list) => list.filter((e) => e.id !== id))));
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
