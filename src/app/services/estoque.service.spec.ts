import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Estoque } from '../models/estoque';
import { EstoqueService } from './estoque.service';

const URL = 'http://localhost:3000/estoques';

const ESTOQUES: Estoque[] = [
  { id: 1, nome: 'X', endereco: 'Rua dos bobos, 1500', cidade: 'BH', telefone: '999999999' },
  { id: 2, nome: 'TP', endereco: 'Rua das estrelas, 1200', cidade: 'BH', telefone: '000000000' },
  { id: 3, nome: 'Bond', endereco: 'Rua dos almirantes, 1002', cidade: 'BH', telefone: '000000007' },
];

const novo = { nome: ' Centro ', endereco: 'Rua 1, 10', cidade: 'BH', telefone: '31999990000' };

describe('EstoqueService', () => {
  let service: EstoqueService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EstoqueService);
    http = TestBed.inject(HttpTestingController);
    http.expectOne({ method: 'GET', url: URL }).flush(ESTOQUES);
  });

  afterEach(() => http.verify());

  it('should load the estoques from the API', () => {
    expect(service.estoques().map((e) => e.nome)).toEqual(['X', 'TP', 'Bond']);
    expect(service.nextId()).toBe(4);
  });

  it('should POST a new estoque and add the API response to the list', () => {
    service.add(novo).subscribe();

    const req = http.expectOne({ method: 'POST', url: URL });
    expect(req.request.body).toEqual({ ...novo, nome: 'Centro' });
    req.flush({ id: 4, ...novo, nome: 'Centro' });

    expect(service.estoques()).toHaveLength(4);
    expect(service.getById(4)?.nome).toBe('Centro');
  });

  it('should PUT the edited estoque keeping its id', () => {
    const dados = { nome: 'TP2', endereco: 'Rua nova, 5', cidade: 'Contagem', telefone: '1' };
    service.update(2, dados).subscribe();

    const req = http.expectOne({ method: 'PUT', url: `${URL}/2` });
    expect(req.request.body).toEqual({ id: 2, ...dados });
    req.flush({ id: 2, ...dados });

    expect(service.getById(2)?.cidade).toBe('Contagem');
    expect(service.getById(1)?.nome).toBe('X');
  });

  it('should DELETE an estoque and remove it from the list', () => {
    service.remove(3).subscribe();
    http.expectOne({ method: 'DELETE', url: `${URL}/3` }).flush({});

    expect(service.estoques().map((e) => e.id)).toEqual([1, 2]);
  });

  it('should filter by id, nome, endereco, cidade or telefone', () => {
    service.setSearchTerm('almirantes');
    expect(service.filteredEstoques().map((e) => e.id)).toEqual([3]);

    service.setSearchTerm('#2');
    expect(service.filteredEstoques().map((e) => e.id)).toEqual([2]);

    service.setSearchTerm('bh');
    expect(service.filteredEstoques()).toHaveLength(3);
  });

  it('should expose an error message when the API is offline', () => {
    service.carregar();
    http.expectOne(URL).error(new ProgressEvent('error'));

    expect(service.erro()).toContain('API');
    expect(service.carregando()).toBe(false);
  });
});
