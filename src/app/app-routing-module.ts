import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './pages/cadastro/cadastro';
import { Login } from './pages/login/login';

const routes: Routes = [
  { path: 'cadastro', component: Cadastro },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
