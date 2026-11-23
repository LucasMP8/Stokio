import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './pages/cadastro/cadastro';

const routes: Routes = [
  { path: 'cadastro', component: Cadastro },
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
