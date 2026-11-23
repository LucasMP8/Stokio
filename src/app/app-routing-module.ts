import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './pages/cadastro/cadastro';
import { Login } from './pages/login/login';
import { Inventory } from './pages/inventory/inventory';
import { CardDetail } from './pages/card-detail/card-detail';
import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { RegistroMovimento } from './pages/registro-movimento/registro-movimento';
import { Settings } from './pages/settings/settings';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Login | Stokio' },
  { path: 'cadastro', component: Cadastro, title: 'Cadastro | Stokio' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard | Stokio' },
  { path: 'produtos', component: Produtos, title: 'Produtos | Stokio' },
  { path: 'inventory', component: Inventory, title: 'Gerenciar inventário | Stokio' },
  { path: 'inventory/:id', component: CardDetail, title: 'Detalhes do estoque | Stokio' },
  {
    path: 'registro-movimento',
    component: RegistroMovimento,
    title: 'Registro de movimento | Stokio',
  },
  { path: 'settings', component: Settings, title: 'Settings | Stokio' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}