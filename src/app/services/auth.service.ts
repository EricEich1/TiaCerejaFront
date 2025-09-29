import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Usuario } from '../models/usuario.model';
import { API_CONFIG } from '../shared/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = `${API_CONFIG.baseUrl}/api/auth/login`;
  private readonly registerUrl = `${API_CONFIG.baseUrl}/api/auth/registrar`;

  // Este BehaviorSubject vai "transmitir" o status de login para quem quiser ouvir (como a Navbar)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  // BehaviorSubject para armazenar dados do usuário logado
  private currentUser = new BehaviorSubject<Usuario | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
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