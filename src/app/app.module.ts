import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';

import { InventoryComponent } from './pages/inventory/inventory.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ManageStoreComponent } from './pages/manage-store/manage-store.component';
import { SettingsComponent } from './pages/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    InventoryComponent,
    CardDetailComponent,
    DashboardComponent,
    ReportsComponent,
    OrdersComponent,
    ManageStoreComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
