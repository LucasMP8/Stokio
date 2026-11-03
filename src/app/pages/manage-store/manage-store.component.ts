import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-store',
  templateUrl: './manage-store.component.html',
})
export class ManageStoreComponent {
  constructor(private router: Router) {}

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
