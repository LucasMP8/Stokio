import { TestBed } from '@angular/core/testing';

import { ProdutoService, ProdutoInput } from './produto.service';

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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoService);
  });

  it('should start with three products', () => {
    expect(service.produtos().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should create a product with automatic id and code', () => {
    const produto = service.add(novo);

    expect(produto).toEqual({
      ...novo,
      nome: 'Arroz 5kg',
      id: 4,
      codigo: 'SKU-004',
      unidade: 'Unidade',
      ativo: true,
    });
    expect(service.nextId()).toBe(5);
  });

  it('should edit a product keeping id, code and unit', () => {
    service.update(1, { ...novo, nome: 'Café 1kg' });

    const produto = service.getById(1);
    expect(produto?.nome).toBe('Café 1kg');
    expect(produto?.codigo).toBe('SKU-001');
    expect(produto?.unidade).toBe('Pacote');
  });

  it('should compute the stock situation', () => {
    const base = service.getById(1)!;
    expect(service.situacao({ ...base, quantidade: 0 })).toBe('sem-estoque');
    expect(service.situacao({ ...base, quantidade: 10, estoqueMinimo: 10 })).toBe('estoque-baixo');
    expect(service.situacao({ ...base, quantidade: 11, estoqueMinimo: 10 })).toBe('em-estoque');
  });
});
