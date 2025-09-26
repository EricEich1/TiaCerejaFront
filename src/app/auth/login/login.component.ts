import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    email: '',
    senha: ''
  };
  
  loading = false;
  formSubmitted = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Limpar dados de login anteriores
    this.authService.logout().subscribe();
  }

  // Método para testar se os dados estão sendo capturados
  testFormData() {
    console.log('=== TESTE DE DADOS DO FORMULÁRIO ===');
    console.log('credentials:', this.credentials);
    console.log('email:', this.credentials.email);
    console.log('senha:', this.credentials.senha);
    
    // Preencher dados de teste
    this.credentials.email = 'admin@sistema.com';
    this.credentials.senha = '123456';
    
    console.log('Dados de teste preenchidos:', this.credentials);
    
    // Testar se os dados estão sendo capturados corretamente
    setTimeout(() => {
      console.log('Dados após 1 segundo:', this.credentials);
    }, 1000);
  }

  // Método para testar binding em tempo real
  onEmailChange(event: any) {
    console.log('Email mudou:', event.target.value);
    this.credentials.email = event.target.value;
    console.log('Credentials atualizado:', this.credentials);
  }

  onSenhaChange(event: any) {
    console.log('Senha mudou:', event.target.value);
    this.credentials.senha = event.target.value;
    console.log('Credentials atualizado:', this.credentials);
  }

  // Método para testar requisição HTTP direta
  testHttpRequest() {
    console.log('=== TESTE HTTP DIRETO ===');
    
    const testData = {
      email: 'admin@sistema.com',
      senha: '123456'
    };
    
    console.log('Enviando dados de teste:', testData);
    console.log('URL:', 'http://localhost:8080/api/auth/login');
    
    // Fazer requisição direta
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      return response.text();
    })
    .then(data => {
      console.log('Response data:', data);
      try {
        const jsonData = JSON.parse(data);
        console.log('Parsed JSON:', jsonData);
      } catch (e) {
        console.log('Response is not JSON:', data);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  }

  // Método para criar admin (desenvolvimento)
  criarAdmin() {
    const adminData = {
      email: 'admin@sistema.com',
      senha: '123456',
      nome: 'Administrador',
      role: 'ADMIN'
    };

    console.log('=== CRIANDO ADMIN ===');
    console.log('Dados do admin:', adminData);

    this.authService.criarAdmin(adminData).subscribe({
      next: (response) => {
        console.log('Admin criado com sucesso:', response);
        Swal.fire({
          icon: 'success',
          title: 'Admin criado!',
          text: 'Usuário administrador criado com sucesso!',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Erro ao criar admin:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao criar admin',
          text: 'Não foi possível criar o usuário administrador.',
          footer: `Status: ${error.status || 'N/A'}`
        });
      }
    });
  }

  // Validação de email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validação de senha
  isValidPassword(password: string): boolean {
    return Boolean(password && password.length >= 3);
  }

  // Validação completa do formulário
  validateForm(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.credentials.email || this.credentials.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(this.credentials.email.trim())) {
      errors.push('Email deve ter um formato válido');
    }

    if (!this.credentials.senha || this.credentials.senha.trim() === '') {
      errors.push('Senha é obrigatória');
    } else if (!this.isValidPassword(this.credentials.senha.trim())) {
      errors.push('Senha deve ter pelo menos 3 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  login() {
    this.formSubmitted = true;
    
    // Debug: Verificar dados antes da validação
    console.log('=== DEBUG LOGIN ===');
    console.log('credentials object:', this.credentials);
    console.log('email value:', this.credentials.email);
    console.log('senha value:', this.credentials.senha);
    console.log('email type:', typeof this.credentials.email);
    console.log('senha type:', typeof this.credentials.senha);
    console.log('email length:', this.credentials.email?.length);
    console.log('senha length:', this.credentials.senha?.length);
    
    // Validação customizada
    const validation = this.validateForm();
    if (!validation.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Dados inválidos',
        text: validation.errors.join('\n')
      });
      return;
    }

    // Limpar espaços em branco e criar objeto limpo
    const loginData: LoginRequest = {
      email: this.credentials.email.trim(),
      senha: this.credentials.senha.trim()
    };

    this.loading = true;
    
    // Debug: Log dos dados sendo enviados
    console.log('Dados finais sendo enviados:', loginData);
    console.log('URL do endpoint:', 'http://localhost:8080/api/auth/login');
    
    // Fazer a requisição
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login realizado com sucesso:', response);
        
        Swal.fire({
          icon: 'success',
          title: 'Login realizado!',
          text: `Bem-vindo, ${response.usuario.nome || response.usuario.email}!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro completo no login:', error);
        console.error('Status:', error.status);
        console.error('Error body:', error.error);
        console.error('Headers:', error.headers);
        
        let mensagemErro = 'Erro no login';
        let detalhesErro = '';
        
        if (error.status === 0) {
          mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
        } else if (error.status === 400) {
          mensagemErro = 'Dados inválidos enviados ao servidor';
          detalhesErro = error.error ? JSON.stringify(error.error) : 'Verifique o formato dos dados';
        } else if (error.status === 401) {
          mensagemErro = 'Email ou senha incorretos!';
        } else if (error.status === 404) {
          mensagemErro = 'Endpoint de login não encontrado. Verifique se o backend está rodando.';
        } else if (error.error && error.error.message) {
          mensagemErro = error.error.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Erro no login',
          text: mensagemErro,
          footer: `Status: ${error.status || 'N/A'}${detalhesErro ? ` | Detalhes: ${detalhesErro}` : ''}`
        });
      }
    });
  }
}