import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BuscaService, ResultadoBusca } from '../../services/busca.service';
import { Usuario } from '../../models/usuario.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  isLoggedIn = false;
  currentUser: Usuario | null = null;
  
  // Busca
  termoBusca = '';
  resultados: ResultadoBusca[] = [];
  mostrarResultados = false;
  buscando = false;
  private buscaSubject = new Subject<string>();

  constructor(
    private router: Router,
    public authService: AuthService,
    private buscaService: BuscaService
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

    // Configurar busca com debounce
    this.buscaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(termo => {
        if (termo.length < 2) {
          this.resultados = [];
          this.mostrarResultados = false;
          return of([]);
        }
        this.buscando = true;
        return this.buscaService.buscar(termo);
      })
    ).subscribe(resultados => {
      this.resultados = resultados;
      this.buscando = false;
      this.mostrarResultados = resultados.length > 0 && this.termoBusca.length >= 2;
    });
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

  onBuscaChange() {
    this.buscaSubject.next(this.termoBusca);
  }

  onBuscaFocus() {
    if (this.resultados.length > 0 && this.termoBusca.length >= 2) {
      this.mostrarResultados = true;
    }
  }

  onBuscaBlur() {
    setTimeout(() => {
      this.mostrarResultados = false;
    }, 200);
  }

  selecionarResultado(resultado: ResultadoBusca) {
    this.termoBusca = '';
    this.resultados = [];
    this.mostrarResultados = false;
    this.router.navigate([resultado.rota]);
  }

  limparBusca() {
    this.termoBusca = '';
    this.resultados = [];
    this.mostrarResultados = false;
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