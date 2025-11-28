import { Routes } from '@angular/router';
import { UsuarioManagementComponent } from './usuario-management/usuario-management.component';

export const adminRoutes: Routes = [
    {
        path: 'usuarios',
        component: UsuarioManagementComponent
    },
    {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
    }
];
