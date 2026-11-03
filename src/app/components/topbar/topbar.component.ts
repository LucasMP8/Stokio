import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent {
  searchTerm = '';

  constructor(
    private cardService: CardService,
    private router: Router,
  ) {}

  /** Atualiza o filtro e leva o usuário para a lista de cards, se estiver em outra página. */
  onSearch(term: string): void {
    this.cardService.setSearchTerm(term);
    if (this.router.url !== '/inventory') {
      this.router.navigate(['/inventory']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.cardService.setSearchTerm('');
  }
}
