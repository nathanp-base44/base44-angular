import { Component } from '@angular/core';
import { RevenueChartComponent } from '../../dashboard/revenue-chart.component';
import { CategoryChartComponent } from '../../dashboard/category-chart.component';
import { OrdersTableComponent } from '../../dashboard/orders-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RevenueChartComponent, CategoryChartComponent, OrdersTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
