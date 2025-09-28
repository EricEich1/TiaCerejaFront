// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  credentials: LoginRequest = {
    login: '', // <-- ALTERADO para 'login'
    senha: ''
  };
  
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    if (!this.credentials.login || !this.credentials.senha) {
      Swal.fire('Atenção!', 'Por favor, preencha o email e a senha.', 'warning');
      return;
    }

    this.loading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Login realizado!',
          text: `Bem-vindo!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (errorResponse) => { // <-- Renomeei para errorResponse para ficar mais claro
        this.loading = false;
        console.error('Erro completo no login:', errorResponse);
        
        // LÓGICA DE ERRO APRIMORADA
        let mensagemErro = 'Ocorreu um erro inesperado. Tente novamente.'; // Mensagem padrão

        if (errorResponse.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (errorResponse.error) {
          // Pega a mensagem de erro customizada que o backend enviou!
          mensagemErro = errorResponse.error;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Ops... Falha no login',
          text: mensagemErro,
        });
      }
    });
  }
}