import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, switchMap, tap, throwError } from 'rxjs';

import { API_URL } from '../api';
import { MotivoSaida, Movimentacao, TipoMovimentacao } from '../models/movimentacao';
import { ProdutoService } from './produto.service';

export const MOTIVOS_SAIDA: { valor: MotivoSaida; rotulo: string }[] = [
  { valor: 'venda', rotulo: 'Venda' },
  { valor: 'perda', rotulo: 'Perda' },
  { valor: 'uso-interno', rotulo: 'Uso interno' },
];

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private readonly http = inject(HttpClient);
  private readonly produtoService = inject(ProdutoService);
  private readonly url = `${API_URL}/movimentacoes`;

  /** Movimentações registradas, da mais recente para a mais antiga. */
  private readonly lista = signal<Movimentacao[]>([]);

  readonly movimentacoes = this.lista.asReadonly();
  readonly erro = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.carregar();
    }
  }

  carregar(): void {
    this.http.get<Movimentacao[]>(`${this.url}?_sort=data&_order=desc`).subscribe({
      next: (movimentacoes) => {
        this.lista.set(movimentacoes);
        this.erro.set(null);
      },
      error: () =>
        this.erro.set('Não foi possível carregar as movimentações. Verifique se a API está rodando.'),
    });
  }

  /**
   * Registra uma entrada ou uma retirada (venda, perda ou uso interno):
   * atualiza o saldo do produto e grava o histórico da movimentação.
   */
  registrar(
    produtoId: number,
    tipo: TipoMovimentacao,
    quantidade: number,
    motivo: MotivoSaida | null,
  ): Observable<Movimentacao> {
    if (tipo === 'saida' && !motivo) {
      return throwError(() => new Error('Informe o motivo da retirada.'));
    }
    const saldoAnterior = this.produtoService.getById(produtoId)?.quantidade ?? 0;

    return this.produtoService.movimentar(produtoId, tipo, quantidade).pipe(
      switchMap((produto) =>
        this.http.post<Movimentacao>(this.url, {
          produtoId,
          tipo,
          motivo: tipo === 'saida' ? motivo : null,
          quantidade,
          saldoAnterior,
          saldoAtual: produto.quantidade,
          data: new Date().toISOString(),
        }),
      ),
      tap((movimentacao) => this.lista.update((list) => [movimentacao, ...list])),
    );
  }

  rotuloMotivo(motivo: MotivoSaida | null): string {
    return MOTIVOS_SAIDA.find((m) => m.valor === motivo)?.rotulo ?? '—';
  }
}
