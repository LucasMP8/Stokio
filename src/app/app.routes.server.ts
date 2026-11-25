import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Páginas que buscam dados na API (JSON-Server) são renderizadas no navegador.
    path: 'inventory',
    renderMode: RenderMode.Client,
  },
  {
    path: 'inventory/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'produtos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'registro-movimento',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
