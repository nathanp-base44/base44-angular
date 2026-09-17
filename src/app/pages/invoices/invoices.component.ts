import { Component } from '@angular/core';

interface Invoice {
  number: string;
  client: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  invoices: Invoice[] = [
    { number: 'INV-1001', client: 'Acme Corp', date: '2026-09-01', amount: '$1,200.00', status: 'Paid' },
    { number: 'INV-1002', client: 'Globex LLC', date: '2026-09-03', amount: '$840.50', status: 'Pending' },
    { number: 'INV-1003', client: 'Initech', date: '2026-08-28', amount: '$2,150.00', status: 'Overdue' },
    { number: 'INV-1004', client: 'Umbrella Inc', date: '2026-09-05', amount: '$3,400.00', status: 'Paid' },
    { number: 'INV-1005', client: 'Stark Industries', date: '2026-09-07', amount: '$980.00', status: 'Pending' },
    { number: 'INV-1006', client: 'Wayne Enterprises', date: '2026-08-30', amount: '$5,600.00', status: 'Paid' },
    { number: 'INV-1007', client: 'Soylent Corp', date: '2026-09-02', amount: '$430.75', status: 'Overdue' },
    { number: 'INV-1008', client: 'Hooli', date: '2026-09-08', amount: '$1,990.00', status: 'Pending' },
    { number: 'INV-1009', client: 'Pied Piper', date: '2026-09-10', amount: '$760.25', status: 'Paid' },
    { number: 'INV-1010', client: 'Vandelay Ind.', date: '2026-09-12', amount: '$2,820.00', status: 'Pending' },
  ];
}
