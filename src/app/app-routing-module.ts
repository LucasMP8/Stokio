import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Inventory } from './pages/inventory/inventory';
import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { RegistroMovimento } from './pages/registro-movimento/registro-movimento';
import { Settings } from './pages/settings/settings';

const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard | Stokio' },
  { path: 'produtos', component: Produtos, title: 'Produtos | Stokio' },
  { path: 'inventory', component: Inventory, title: 'Gerenciar inventário | Stokio' },
  {
    path: 'registro-movimento',
    component: RegistroMovimento,
    title: 'Registro de movimento | Stokio',
  },
  { path: 'settings', component: Settings, title: 'Settings | Stokio' },
  { path: '**', redirectTo: 'inventory' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
