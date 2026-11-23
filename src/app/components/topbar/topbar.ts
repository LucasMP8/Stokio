import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private readonly estoqueService = inject(EstoqueService);
  private readonly router = inject(Router);

  protected readonly searchTerm = this.estoqueService.searchTerm;

  /** Atualiza o filtro e leva o usuário para a lista de estoques, se estiver em outra página. */
  onSearch(term: string): void {
    this.estoqueService.setSearchTerm(term);
    if (this.router.url !== '/inventory') {
      this.router.navigate(['/inventory']);
    }
  }

  clearSearch(): void {
    this.estoqueService.setSearchTerm('');
  }
}
