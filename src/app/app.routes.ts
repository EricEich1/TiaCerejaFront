import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Rota de login (pública)
  {
    path: 'login',
    component: LoginComponent
  },
  // Rotas protegidas (requerem autenticação)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'clientes',
        loadChildren: () => import('./components/cliente/cliente.routes').then(m => m.clienteRoutes)
      },
      {
        path: 'enderecos',
        loadChildren: () => import('./components/endereco/endereco.routes').then(m => m.enderecoRoutes)
      },
      {
        path: 'temas',
        loadChildren: () => import('./components/tema/tema.routes').then(m => m.temaRoutes)
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () => import('./components/admin/admin.routes').then(m => m.adminRoutes)
      }
      // {
      //   path: 'solicitacoes',
      //   loadChildren: () => import('./components/solicitacao/solicitacao.routes').then(m => m.solicitacaoRoutes)
      // },
      // {
      //   path: 'tipos-evento',
      //   loadChildren: () => import('./components/tipo-evento/tipo-evento.routes').then(m => m.tipoEventoRoutes)
      // }
    ]
  },
  // Redirecionamento padrão para login
  {
    path: '**',
    redirectTo: '/login'
  }
];
