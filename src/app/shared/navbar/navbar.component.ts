import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn = false;
  currentUser: Usuario | null = null;

  constructor(
    private router: Router,
    public authService: AuthService // Deixe como public para usar no HTML
  ) {}

  ngOnInit(): void {
    // Escuta as mudanças no status de login
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    // Escuta as mudanças nos dados do usuário
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // Verificar dados iniciais
    const initialUser = this.authService.getCurrentUserValue();
    if (initialUser) {
      this.currentUser = initialUser;
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // Método para obter o nome de exibição do usuário
  getUserDisplayName(): string {
    if (!this.currentUser) return 'Usuário Logado';
    
    // Prioriza o nome se disponível, senão usa o email
    return this.currentUser.nome || this.currentUser.email || 'Usuário Logado';
  }

  logout() {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você será desconectado da sua sessão.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, sair!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout(); // Apenas chama o logout
        this.router.navigate(['/login']); // Redireciona para o login
        Swal.fire(
          'Desconectado!',
          'Você saiu da sua conta com sucesso.',
          'success'
        )
      }
    })
  }
}