export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string;
  ativo: boolean;
  estoqueId: number;
}
