import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  constructor(private router: Router) {}

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
