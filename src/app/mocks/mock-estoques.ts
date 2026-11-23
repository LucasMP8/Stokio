import { Estoque } from '../models/estoque';

/**
 * Lista estática (mock) com os estoques cadastrados em db.json,
 * usada para simular os dados reais da aplicação.
 */
export const MOCK_ESTOQUES: Estoque[] = [
  {
    id: 1,
    nome: 'X',
    endereco: 'Rua dos bobos, 1500',
    cidade: 'BH',
    telefone: '999999999',
  },
  {
    id: 2,
    nome: 'TP',
    endereco: 'Rua das estrelas, 1200',
    cidade: 'BH',
    telefone: '000000000',
  },
  {
    id: 3,
    nome: 'Bond',
    endereco: 'Rua dos almirantes, 1002',
    cidade: 'BH',
    telefone: '000000007',
  },
];
