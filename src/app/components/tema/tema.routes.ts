import { Routes } from '@angular/router';
import { TemaListComponent } from './tema-list/tema-list.component';
import { TemaFormComponent } from './tema-form/tema-form.component';

export const temaRoutes: Routes = [
  {
    path: '',
    component: TemaListComponent
  },
  {
    path: 'novo',
    component: TemaFormComponent
  },
  {
    path: 'editar/:id',
    component: TemaFormComponent
  }
];

