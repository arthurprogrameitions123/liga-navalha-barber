import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { auth } from './services/firebase';

const guard = async () => {
  const router = inject(Router);
  await auth.authStateReady();
  return auth.currentUser ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'servicos' },

  { 
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },

  { path: 'servicos', canActivate: [guard], loadComponent: () => import('./pages/servicos/servicos.page').then(m => m.ServicosPage) },
  { path: 'comanda', canActivate: [guard], loadComponent: () => import('./pages/comanda/comanda.page').then(m => m.ComandaPage) },
];