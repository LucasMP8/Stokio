import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Cadastro } from './pages/cadastro/cadastro';
import { Login } from './pages/login/login';
import { Sidebar } from './components/sidebar/sidebar';

@NgModule({
  declarations: [
    App,
    Cadastro,
    Login,
    Sidebar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration()
  ],
  bootstrap: [App]
})
export class AppModule {}