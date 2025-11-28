// src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  isRegisterMode = false;
  
  credentials: LoginRequest = {
    login: '',
    senha: ''
  };
  
  registerData: RegisterRequest = {
    email: '',
    senha: '',
    nome: ''
  };
  
  confirmPassword = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.resetForms();
  }

  resetForms() {
    this.credentials = { login: '', senha: '' };
    this.registerData = { email: '', senha: '', nome: '' };
    this.confirmPassword = '';
  }

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
      error: (errorResponse) => {
        this.loading = false;
        console.error('Erro completo no login:', errorResponse);
        
        let mensagemErro = 'Ocorreu um erro inesperado. Tente novamente.';

        if (errorResponse.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else if (errorResponse.error) {
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

  register() {
    if (!this.registerData.email || !this.registerData.senha || !this.registerData.nome) {
      Swal.fire('Atenção!', 'Por favor, preencha todos os campos.', 'warning');
      return;
    }

    if (this.registerData.senha !== this.confirmPassword) {
      Swal.fire('Atenção!', 'As senhas não coincidem.', 'warning');
      return;
    }

    if (this.registerData.senha.length < 6) {
      Swal.fire('Atenção!', 'A senha deve ter no mínimo 6 caracteres.', 'warning');
      return;
    }

    this.loading = true;
    
    console.log('Dados que serão enviados:', this.registerData);
    
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Resposta do registro:', response);
        Swal.fire({
          icon: 'success',
          title: 'Conta criada!',
          text: 'Usuário registrado com sucesso. Faça login para continuar.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.isRegisterMode = false;
          this.resetForms();
        });
      },
      error: (errorResponse) => {
        this.loading = false;
        console.error('=== ERRO NO REGISTRO ===');
        console.error('Status:', errorResponse.status);
        console.error('Status Text:', errorResponse.statusText);
        console.error('Error Body:', errorResponse.error);
        console.error('URL:', errorResponse.url);
        console.error('Headers:', errorResponse.headers);
        console.error('Erro completo:', JSON.stringify(errorResponse, null, 2));
        
        let mensagemErro = 'Ocorreu um erro inesperado. Tente novamente.';

        if (errorResponse.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
        } else if (errorResponse.status === 403) {
          // Tenta pegar a mensagem específica do backend primeiro
          if (errorResponse.error) {
            if (typeof errorResponse.error === 'string') {
              mensagemErro = errorResponse.error;
            } else if (errorResponse.error.message) {
              mensagemErro = errorResponse.error.message;
            } else if (errorResponse.error.error) {
              mensagemErro = errorResponse.error.error;
            } else {
              mensagemErro = 'Acesso negado (403). Possíveis causas:\n\n' +
                           '1. CORS não configurado - Verifique se http://localhost:4200 está na lista de origens permitidas\n' +
                           '2. Endpoint não público - Confirme que /api/auth/registrar está em permitAll() no SecurityConfigurations.java\n' +
                           '3. Verifique os logs do backend para mais detalhes';
            }
          } else {
            mensagemErro = 'Acesso negado (403). Possíveis causas:\n\n' +
                         '1. CORS não configurado - Verifique se http://localhost:4200 está na lista de origens permitidas\n' +
                         '2. Endpoint não público - Confirme que /api/auth/registrar está em permitAll() no SecurityConfigurations.java\n' +
                         '3. Verifique os logs do backend para mais detalhes';
          }
        } else if (errorResponse.status === 404) {
          mensagemErro = 'Endpoint não encontrado (404). Verifique se o backend está rodando e se a URL /api/auth/registrar está correta.';
        } else if (errorResponse.status === 400) {
          const errorMsg = errorResponse.error?.message || 
                          (typeof errorResponse.error === 'string' ? errorResponse.error : null) ||
                          errorResponse.error?.error ||
                          'Dados inválidos. Verifique as informações fornecidas.';
          mensagemErro = errorMsg;
        } else if (errorResponse.status === 409) {
          mensagemErro = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (errorResponse.error) {
          if (typeof errorResponse.error === 'string') {
            mensagemErro = errorResponse.error;
          } else if (errorResponse.error.message) {
            mensagemErro = errorResponse.error.message;
          } else if (errorResponse.error.error) {
            mensagemErro = errorResponse.error.error;
          }
        } else if (errorResponse.message) {
          mensagemErro = errorResponse.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Ops... Falha no registro',
          html: mensagemErro.replace(/\n/g, '<br>'),
          width: '600px'
        });
      }
    });
  }
}