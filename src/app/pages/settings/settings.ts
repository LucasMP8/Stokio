import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
})
export class Settings {
  private readonly router = inject(Router);

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
