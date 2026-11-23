import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-movimento',
  standalone: false,
  templateUrl: './registro-movimento.html',
})
export class RegistroMovimento {
  private readonly router = inject(Router);

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
