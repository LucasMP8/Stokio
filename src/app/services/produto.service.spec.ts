import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Produto } from '../models/produto';
import { ProdutoService, ProdutoInput } from './produto.service';

const URL = 'http://localhost:3000/produtos';

const base: Omit<Produto, 'id' | 'nome' | 'quantidade' | 'estoqueMinimo'> = {
  codigo: 'SKU-000',
  categoria: 'Alimentos',
  precoCusto: 10,
  precoVenda: 20,
  unidade: 'Pacote',
  ativo: true,
  estoqueId: 1,
};

const PRODUTOS: Produto[] = [
  { ...base, id: 1, codigo: 'SKU-001', nome: 'Café', quantidade: 35, estoqueMinimo: 10 },
  { ...base, id: 2, codigo: 'SKU-002', nome: 'Refrigerante', quantidade: 8, estoqueMinimo: 10 },
];

const novo: ProdutoInput = {
  nome: ' Arroz 5kg ',
  categoria: 'Alimentos',
  precoCusto: 18,
  precoVenda: 27.9,
  quantidade: 20,
  estoqueMinimo: 5,
  estoqueId: 3,
};

describe('ProdutoService', () => {
  let service: ProdutoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProdutoService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne({ method: 'GET', url: URL }).flush(PRODUTOS);
  });

  afterEach(() => http.verify());

  it('should load the products from the API', () => {
    expect(service.produtos().map((p) => p.id)).toEqual([1, 2]);
  });

  it('should POST a new product with automatic code, unit and active flag', () => {
    service.add(novo).subscribe();

    const req = http.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toEqual({
      ...novo,
      nome: 'Arroz 5kg',
      codigo: 'SKU-003',
      unidade: 'Unidade',
      ativo: true,
    });
    req.flush({ id: 3, ...req.request.body });

    expect(service.getById(3)?.nome).toBe('Arroz 5kg');
  });

  it('should PATCH an edited product', () => {
    service.update(1, { ...novo, nome: 'Café 1kg' }).subscribe();

    const req = http.expectOne({ method: 'PATCH', url: `${URL}/1` });
    expect(req.request.body.nome).toBe('Café 1kg');
    req.flush({ ...PRODUTOS[0], ...req.request.body });

    expect(service.getById(1)?.nome).toBe('Café 1kg');
    expect(service.getById(1)?.codigo).toBe('SKU-001');
  });

  it('should add and remove units with PATCH', () => {
    service.movimentar(1, 'entrada', 5).subscribe();
    const entrada = http.expectOne({ method: 'PATCH', url: `${URL}/1` });
    expect(entrada.request.body).toEqual({ quantidade: 40 });
    entrada.flush({ ...PRODUTOS[0], quantidade: 40 });

    service.movimentar(1, 'saida', 15).subscribe();
    const saida = http.expectOne({ method: 'PATCH', url: `${URL}/1` });
    expect(saida.request.body).toEqual({ quantidade: 25 });
    saida.flush({ ...PRODUTOS[0], quantidade: 25 });

    expect(service.getById(1)?.quantidade).toBe(25);
  });

  it('should not allow removing more than the available balance', () => {
    let mensagem = '';
    service.movimentar(2, 'saida', 9).subscribe({ error: (e: Error) => (mensagem = e.message) });

    expect(mensagem).toContain('saldo disponível');
    http.expectNone(`${URL}/2`);
  });

  it('should DELETE a product', () => {
    service.remove(2).subscribe();
    http.expectOne({ method: 'DELETE', url: `${URL}/2` }).flush({});

    expect(service.produtos().map((p) => p.id)).toEqual([1]);
  });

  it('should compute the stock situation', () => {
    const p = service.getById(1)!;
    expect(service.situacao({ ...p, quantidade: 0 })).toBe('sem-estoque');
    expect(service.situacao({ ...p, quantidade: 10, estoqueMinimo: 10 })).toBe('estoque-baixo');
    expect(service.situacao({ ...p, quantidade: 11, estoqueMinimo: 10 })).toBe('em-estoque');
  });
});
