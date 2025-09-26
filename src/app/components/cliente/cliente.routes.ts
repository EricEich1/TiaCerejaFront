import { Routes } from '@angular/router';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

export const clienteRoutes: Routes = [
  {
    path: '',
    component: ClienteListComponent
  },
  {
    path: 'novo',
    component: ClienteFormComponent
  },
  {
    path: 'editar/:id',
    component: ClienteFormComponent
  }
];

