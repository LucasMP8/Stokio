import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Cadastro } from './pages/cadastro/cadastro';
import { Login } from './pages/login/login';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';

import { Inventory } from './pages/inventory/inventory';
import { CardDetail } from './pages/card-detail/card-detail';
import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { RegistroMovimento } from './pages/registro-movimento/registro-movimento';
import { Settings } from './pages/settings/settings';

@NgModule({
  declarations: [
    App,
    Cadastro,
    Login,
    Sidebar,
    Topbar,
    Inventory,
    CardDetail,
    Dashboard,
    Produtos,
    RegistroMovimento,
    Settings,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
