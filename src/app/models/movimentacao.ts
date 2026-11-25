export type TipoMovimentacao = 'entrada' | 'saida';

export type MotivoSaida = 'venda' | 'perda' | 'uso-interno';

export interface Movimentacao {
  id: number;
  produtoId: number;
  tipo: TipoMovimentacao;
  /** Motivo da retirada; nas entradas é null. */
  motivo: MotivoSaida | null;
  quantidade: number;
  saldoAnterior: number;
  saldoAtual: number;
  /** Data e hora no formato ISO. */
  data: string;
}
