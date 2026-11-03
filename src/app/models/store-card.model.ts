/**
 * Estrutura de dados de um card exibido na tela de inventário.
 */
export interface StoreCard {
  /** Identificador gerado automaticamente pelo CardService. */
  id: number;
  /** Nome do card (texto exibido no bloco cinza à esquerda). */
  cardName: string;
  /** Nome exibido em destaque no corpo do card. */
  name: string;
  /** Descrição livre; as quebras de linha são preservadas na exibição. */
  description: string;
}

/** Dados informados pelo usuário ao criar/editar um card (sem o id). */
export type StoreCardInput = Omit<StoreCard, 'id'>;
