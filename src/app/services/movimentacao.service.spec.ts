import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Produto } from '../models/produto';
import { MovimentacaoService } from './movimentacao.service';

const API = 'http://localhost:3000';

const CAFE: Produto = {
  id: 1,
  codigo: 'SKU-001',
  nome: 'Café',
  categoria: 'Alimentos',
  precoCusto: 10,
  precoVenda: 20,
  quantidade: 35,
  estoqueMinimo: 10,
  unidade: 'Pacote',
  ativo: true,
  estoqueId: 1,
};

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovimentacaoService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne(`${API}/produtos`).flush([CAFE]);
    http.expectOne(`${API}/movimentacoes?_sort=data&_order=desc`).flush([]);
  });

  afterEach(() => http.verify());

  it('should register a sale: discount the balance and save the history', () => {
    service.registrar(1, 'saida', 5, 'venda').subscribe();

    const patch = http.expectOne({ method: 'PATCH', url: `${API}/produtos/1` });
    expect(patch.request.body).toEqual({ quantidade: 30 });
    patch.flush({ ...CAFE, quantidade: 30 });

    const post = http.expectOne({ method: 'POST', url: `${API}/movimentacoes` });
    expect(post.request.body).toEqual(
      expect.objectContaining({
        produtoId: 1,
        tipo: 'saida',
        motivo: 'venda',
        quantidade: 5,
        saldoAnterior: 35,
        saldoAtual: 30,
      }),
    );
    post.flush({ id: 1, ...post.request.body });

    expect(service.movimentacoes()).toHaveLength(1);
    expect(service.movimentacoes()[0].motivo).toBe('venda');
  });

  it('should register losses and internal use as removals', () => {
    for (const [motivo, saldo] of [
      ['perda', 33],
      ['uso-interno', 31],
    ] as const) {
      service.registrar(1, 'saida', 2, motivo).subscribe();
      http.expectOne(`${API}/produtos/1`).flush({ ...CAFE, quantidade: saldo });
      const post = http.expectOne(`${API}/movimentacoes`);
      expect(post.request.body.motivo).toBe(motivo);
      post.flush({ id: saldo, ...post.request.body });
    }
  });

  it('should require a reason when removing units', () => {
    let mensagem = '';
    service.registrar(1, 'saida', 5, null).subscribe({ error: (e: Error) => (mensagem = e.message) });

    expect(mensagem).toContain('motivo');
    http.expectNone(`${API}/produtos/1`);
  });

  it('should save entries without a reason', () => {
    service.registrar(1, 'entrada', 10, 'venda').subscribe();
    http.expectOne(`${API}/produtos/1`).flush({ ...CAFE, quantidade: 45 });

    const post = http.expectOne(`${API}/movimentacoes`);
    expect(post.request.body.motivo).toBeNull();
    expect(post.request.body.saldoAtual).toBe(45);
    post.flush({ id: 1, ...post.request.body });
  });

  it('should not save the history when the removal exceeds the balance', () => {
    let mensagem = '';
    service.registrar(1, 'saida', 36, 'venda').subscribe({ error: (e: Error) => (mensagem = e.message) });

    expect(mensagem).toContain('saldo disponível');
    http.expectNone(`${API}/movimentacoes`);
  });
});
