import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home),
    title: 'Home'
  },
  {
    path: 'input-form',
    loadComponent: () =>
      import('./pages/input-form/input-form').then(m => m.InputForm),
    title: 'Input Form'
  },
  { path: '**', redirectTo: '' }
];
