import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn = false;

  constructor(
    private router: Router,
    public authService: AuthService // Deixe como public para usar no HTML
  ) {}

  ngOnInit(): void {
    // Escuta as mudanças no status de login
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
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