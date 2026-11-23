import { TestBed } from '@angular/core/testing';

import { EstoqueService } from './estoque.service';

const novo = { nome: ' Centro ', endereco: 'Rua 1, 10', cidade: 'BH', telefone: '31999990000' };

describe('EstoqueService', () => {
  let service: EstoqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstoqueService);
  });

  it('should start with the estoques from db.json', () => {
    expect(service.estoques().map((e) => e.nome)).toEqual(['X', 'TP', 'Bond']);
  });

  it('should create an estoque with an automatic id', () => {
    const estoque = service.add(novo);

    expect(estoque).toEqual({ id: 4, ...novo, nome: 'Centro' });
    expect(service.estoques()).toHaveLength(4);
    expect(service.nextId()).toBe(5);
  });

  it('should edit only the given estoque and keep its id', () => {
    service.update(2, { nome: 'TP2', endereco: 'Rua nova, 5', cidade: 'Contagem', telefone: '1' });

    expect(service.getById(2)).toEqual({
      id: 2,
      nome: 'TP2',
      endereco: 'Rua nova, 5',
      cidade: 'Contagem',
      telefone: '1',
    });
    expect(service.getById(1)?.nome).toBe('X');
  });

  it('should filter by id, nome, endereco, cidade or telefone', () => {
    service.setSearchTerm('almirantes');
    expect(service.filteredEstoques().map((e) => e.id)).toEqual([3]);

    service.setSearchTerm('#2');
    expect(service.filteredEstoques().map((e) => e.id)).toEqual([2]);

    service.setSearchTerm('000000007');
    expect(service.filteredEstoques().map((e) => e.id)).toEqual([3]);

    service.setSearchTerm('bh');
    expect(service.filteredEstoques()).toHaveLength(3);

    service.setSearchTerm('');
    expect(service.filteredEstoques()).toHaveLength(3);
  });
});
