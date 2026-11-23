import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';

import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { RegistroMovimento } from './pages/registro-movimento/registro-movimento';
import { Settings } from './pages/settings/settings';

@NgModule({
  declarations: [App, Sidebar, Topbar, Dashboard, Produtos, RegistroMovimento, Settings],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration()],
  bootstrap: [App],
})
export class AppModule {}
