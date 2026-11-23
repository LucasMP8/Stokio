import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'dashboard' | 'produtos' | 'movimento' | 'settings';
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly router = inject(Router);

  protected readonly mainItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Estoques', route: '/inventory', icon: 'home' },
    { label: 'Produtos', route: '/produtos', icon: 'produtos' },
    { label: 'Registro de movimentação', route: '/registro-movimento', icon: 'movimento' },
  ];

  protected readonly bottomItems: NavItem[] = [
    { label: 'Configurações', route: '/settings', icon: 'settings' },
  ];

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
