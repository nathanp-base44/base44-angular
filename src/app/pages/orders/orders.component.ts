import { Component } from '@angular/core';
import { OrdersTableComponent } from '../../dashboard/orders-table.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrdersTableComponent],
  template: `
    <div class="mx-auto max-w-7xl">
      <app-orders-table />
    </div>
  `,
})
export class OrdersComponent {}
