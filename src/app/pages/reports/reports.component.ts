import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  constructor(private router: Router) {}

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}
