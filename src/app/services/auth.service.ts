import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = environment.SERVIDOR + '/api/auth/login';
  private readonly registerUrl = environment.SERVIDOR + '/api/auth/registrar';

  // Este BehaviorSubject vai "transmitir" o status de login para quem quiser ouvir (como a Navbar)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  // BehaviorSubject para armazenar dados do usuário logado
  private currentUser = new BehaviorSubject<Usuario | null>(this.getStoredUser());

  constructor(private http: HttpClient) {
    // Log do ambiente ao inicializar o serviço
    console.log('=== AUTH SERVICE INICIALIZADO ===');
    console.log('Environment SERVIDOR:', environment.SERVIDOR);
    console.log('Environment production:', environment.production);
    console.log('Login URL:', this.loginUrl);
    console.log('Register URL:', this.registerUrl);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('=== INÍCIO DO LOGIN ===');
    console.log('URL de login:', this.loginUrl);
    console.log('Dados que serão enviados:', JSON.stringify(credentials, null, 2));
    console.log('Environment SERVIDOR:', environment.SERVIDOR);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<LoginResponse>(this.loginUrl, credentials, { 
      headers,
      withCredentials: false 
    }).pipe(
      tap({
        next: (response) => {
          console.log('=== LOGIN BEM-SUCEDIDO ===');
          console.log('Resposta do servidor:', response);
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            // Armazenar dados do usuário
            if (response.usuario) {
              localStorage.setItem('user', JSON.stringify(response.usuario));
              this.currentUser.next(response.usuario);
            } else {
              // Fallback: criar dados básicos do usuário se não vierem do backend
              const fallbackUser: Usuario = {
                id: 1,
                email: credentials.login,
                nome: credentials.login.split('@')[0] // Usar parte antes do @ como nome
              };
              localStorage.setItem('user', JSON.stringify(fallbackUser));
              this.currentUser.next(fallbackUser);
              console.log('Usando dados de fallback:', fallbackUser);
            }
            this.loggedIn.next(true); // Avisa que o login foi feito com sucesso
          }
        },
        error: (error) => {
          console.error('=== ERRO NO LOGIN ===');
          console.error('Status:', error.status);
          console.error('Status Text:', error.statusText);
          console.error('URL da requisição:', error.url);
          console.error('Mensagem de erro:', error.message);
          console.error('Erro completo:', error);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    console.log('=== INÍCIO DO REGISTRO ===');
    console.log('URL de registro:', this.registerUrl);
    console.log('URL completa:', environment.SERVIDOR + '/api/auth/registrar');
    console.log('Dados que serão enviados:', JSON.stringify(userData, null, 2));
    console.log('Environment SERVIDOR:', environment.SERVIDOR);
    console.log('Environment production:', environment.production);
    
    // Verificar se a URL está correta
    if (!this.registerUrl.includes('localhost:8080') && !this.registerUrl.includes('18.230.20.100:8080')) {
      console.error('⚠️ ATENÇÃO: URL pode estar incorreta!', this.registerUrl);
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log('Headers que serão enviados:', headers.keys());
    
    return this.http.post<any>(this.registerUrl, userData, { 
      headers,
      withCredentials: false,
      observe: 'response' as const
    }).pipe(
      tap((response: HttpResponse<any>) => {
        console.log('=== REGISTRO BEM-SUCEDIDO ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Headers da resposta:', response.headers.keys());
        console.log('Body da resposta:', response.body);
      }),
      map((response: HttpResponse<any>) => {
        // Retornar apenas o body para o componente
        return response.body;
      }),
      tap({
        error: (error) => {
          console.error('=== ERRO NO REGISTRO ===');
          console.error('Status:', error.status);
          console.error('Status Text:', error.statusText);
          console.error('URL da requisição:', error.url);
          console.error('Mensagem de erro:', error.message);
          
          if (error.status === 0) {
            console.error('ERRO: Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
          } else if (error.status === 403) {
            console.error('ERRO 403: Acesso negado. Possíveis causas:');
            console.error('1. CORS não configurado - Verifique se http://localhost:4200 está permitido');
            console.error('2. Endpoint não público - Verifique SecurityConfigurations.java');
            console.error('3. Verifique a aba Network no DevTools para ver a requisição OPTIONS (preflight)');
          }
          
          console.error('Erro completo:', error);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
    this.loggedIn.next(false); // Avisa que o logout foi feito
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // A Navbar vai "ouvir" este Observable para saber se mostra "Login" ou "Logout"
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Método para obter dados do usuário atual
  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUser.asObservable();
  }

  // Método para obter dados do usuário atual (síncrono)
  getCurrentUserValue(): Usuario | null {
    return this.currentUser.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
        return null;
      }
    }
    return null;
  }
}