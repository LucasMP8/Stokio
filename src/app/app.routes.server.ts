import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Os cards criados pelo usuário existem só no navegador (mock em memória),
    // então a página de detalhes é renderizada no cliente.
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
