import { Routes } from '@angular/router';
import { EnderecoListComponent } from './endereco-list/endereco-list.component';
import { EnderecoFormComponent } from './endereco-form/endereco-form.component';

export const enderecoRoutes: Routes = [
  {
    path: '',
    component: EnderecoListComponent
  },
  {
    path: 'novo',
    component: EnderecoFormComponent
  },
  {
    path: 'editar/:id',
    component: EnderecoFormComponent
  }
];

