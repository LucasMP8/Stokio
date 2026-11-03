import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InventoryComponent } from './pages/inventory/inventory.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ManageStoreComponent } from './pages/manage-store/manage-store.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory/:id', component: CardDetailComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'manage-store', component: ManageStoreComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'inventory' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
