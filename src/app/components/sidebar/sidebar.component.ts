import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'inventory' | 'reports' | 'orders' | 'store' | 'settings';
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  mainItems: NavItem[] = [
    { label: 'Dashobard', route: '/dashboard', icon: 'home' },
    { label: 'Inventory', route: '/inventory', icon: 'inventory' },
    { label: 'Reports', route: '/reports', icon: 'reports' },
    { label: 'Orders', route: '/orders', icon: 'orders' },
    { label: 'Manage Store', route: '/manage-store', icon: 'store' },
  ];

  bottomItems: NavItem[] = [{ label: 'Settings', route: '/settings', icon: 'settings' }];

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/inventory']);
  }

  logout(): void {
    // Ainda não há autenticação: apenas retorna para a página inicial.
    this.router.navigate(['/inventory']);
  }
}
