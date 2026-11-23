import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos',
  standalone: false,
  templateUrl: './produtos.html',
})
export class Produtos {
  private readonly router = inject(Router);

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
