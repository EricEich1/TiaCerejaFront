import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  currentUser: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Observar mudanças no usuário atual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    Swal.fire({
      title: 'Sair do sistema?',
      text: 'Tem certeza que deseja fazer logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, sair!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
            Swal.fire({
              icon: 'success',
              title: 'Logout realizado!',
              text: 'Você foi desconectado com sucesso.',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erro no logout:', error);
            // Mesmo com erro no backend, limpar localmente
            this.router.navigate(['/login']);
            Swal.fire({
              icon: 'warning',
              title: 'Logout realizado',
              text: 'Você foi desconectado (erro na comunicação com o servidor).',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }
}
