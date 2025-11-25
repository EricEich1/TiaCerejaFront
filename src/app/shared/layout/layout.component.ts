import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
