import { Component } from '@angular/core';
import { OrdersTableComponent } from '../../dashboard/orders-table.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersTableComponent],
  template: `
    <div class="mx-auto max-w-7xl space-y-6">
      <h1 class="text-xl font-semibold text-slate-900">Orders</h1>
      <app-orders-table />
    </div>
  `,
})
export class OrdersComponent {}
