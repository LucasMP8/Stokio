import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  exibirLayout = false;
  exibirFooter = false;

  constructor() {
    this.atualizarVisibilidadeLayout(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.atualizarVisibilidadeLayout(event.urlAfterRedirects);
      });
  }

  private atualizarVisibilidadeLayout(url: string): void {
    const rotasSemLayout = ['/login', '/cadastro'];
    const rotasSemFooter = ['/login'];
    const rotaLimpa = url.split('?')[0].split('#')[0];

    this.exibirLayout = !rotasSemLayout.some(
      (rota) => rotaLimpa === rota || rotaLimpa.startsWith(`${rota}/`),
    );

    this.exibirFooter = !rotasSemFooter.some(
      (rota) => rotaLimpa === rota || rotaLimpa.startsWith(`${rota}/`),
    );
  }
}
