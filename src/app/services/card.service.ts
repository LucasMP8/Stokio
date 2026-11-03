import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StoreCard, StoreCardInput } from '../models/store-card.model';
import { MOCK_CARDS } from '../mocks/mock-cards';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  /** Cópia da lista mock, mantida em memória enquanto a aplicação está aberta. */
  private cards: StoreCard[] = MOCK_CARDS.map((card) => ({ ...card }));

  /** Próximo id a ser atribuído automaticamente. */
  private nextId = Math.max(0, ...this.cards.map((c) => c.id)) + 1;

  /** Termo digitado no campo de pesquisa da barra superior. */
  private searchTermSubject = new BehaviorSubject<string>('');
  readonly searchTerm$ = this.searchTermSubject.asObservable();

  getCards(): StoreCard[] {
    return this.cards;
  }

  getCardById(id: number): StoreCard | undefined {
    return this.cards.find((card) => card.id === id);
  }

  /** Filtra os cards pelo id, nome do card, nome ou descrição. */
  searchCards(term: string): StoreCard[] {
    const query = term.trim().toLowerCase();
    if (!query) {
      return this.cards;
    }
    return this.cards.filter(
      (card) =>
        String(card.id) === query.replace('#', '') ||
        card.cardName.toLowerCase().includes(query) ||
        card.name.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query),
    );
  }

  addCard(data: StoreCardInput): StoreCard {
    const card: StoreCard = { id: this.nextId++, ...this.clean(data) };
    this.cards.push(card);
    return card;
  }

  updateCard(id: number, data: StoreCardInput): StoreCard | undefined {
    const card = this.getCardById(id);
    if (card) {
      Object.assign(card, this.clean(data));
    }
    return card;
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  private clean(data: StoreCardInput): StoreCardInput {
    return {
      cardName: data.cardName.trim(),
      name: data.name.trim(),
      description: data.description.trim(),
    };
  }
}
