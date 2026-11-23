import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-card-detail',
  standalone: false,
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly estoqueService = inject(EstoqueService);

  /** ID lido da rota /inventory/:id. */
  private readonly estoqueId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: 0 },
  );

  protected readonly estoque = computed(() => this.estoqueService.getById(this.estoqueId()));

  goBack(): void {
    this.router.navigate(['/inventory']);
  }
}
