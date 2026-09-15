import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  features = [
    {
      title: 'Lightning fast',
      desc: 'Built on a modern stack that ships in milliseconds, so your users never wait.',
      icon: '⚡',
    },
    {
      title: 'Secure by default',
      desc: 'Enterprise-grade encryption and compliance baked in from day one.',
      icon: '🔒',
    },
    {
      title: 'Insightful analytics',
      desc: 'Understand every interaction with dashboards that update in real time.',
      icon: '📊',
    },
  ];

  plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/mo',
      features: ['1 project', 'Community support', '1 GB storage'],
      cta: 'Get started',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/mo',
      features: ['Unlimited projects', 'Priority support', '100 GB storage', 'Advanced analytics'],
      cta: 'Start free trial',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['SSO & SAML', 'Dedicated manager', 'Unlimited storage'],
      cta: 'Contact sales',
      featured: false,
    },
  ];
}
