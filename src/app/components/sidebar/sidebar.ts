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
    { label: 'Dashobard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Produtos', route: '/produtos', icon: 'produtos' },
    { label: 'Home', route: '/inventory', icon: 'home' },
    { label: 'Registro de movimento', route: '/registro-movimento', icon: 'movimento' },
  ];

  protected readonly bottomItems: NavItem[] = [
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  goHome(): void {
    this.router.navigate(['/inventory']);
  }

  logout(): void {
    // Ainda não há autenticação: apenas retorna para a página inicial.
    this.router.navigate(['/inventory']);
  }
}
