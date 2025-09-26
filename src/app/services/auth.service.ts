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
  private readonly baseUrl = API_CONFIG.baseUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (error) {
        // Se não for um JSON válido, limpar o localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const loginUrl = `${this.baseUrl}${API_CONFIG.endpoints.auth.login}`;
    console.log('AuthService - Enviando login para:', loginUrl);
    console.log('AuthService - Dados:', credentials);
    
    return this.http.post<LoginResponse>(loginUrl, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService - Resposta recebida:', response);
          if (response.usuario) {
            this.currentUserSubject.next(response.usuario);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
          }
        })
      );
  }

  // Logout
  logout(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const logoutUrl = `${this.baseUrl}${API_CONFIG.endpoints.auth.logout}`;
      return this.http.post(logoutUrl, {}, {
        headers: { 'Authorization': token }
      }).pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        })
      );
    } else {
      // Se não há token, apenas limpar localmente
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }
  }

  // Validar token
  validateToken(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => {
        observer.error({ status: 401, message: 'Token não encontrado' });
        observer.complete();
      });
    }

    const validateUrl = `${this.baseUrl}${API_CONFIG.endpoints.auth.validate}`;
    return this.http.get(validateUrl, {
      headers: { 'Authorization': token }
    });
  }


  // Verificar se está logado
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Obter usuário atual
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar se é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  // Criar admin (desenvolvimento)
  criarAdmin(adminData: any): Observable<any> {
    const criarAdminUrl = `${this.baseUrl}${API_CONFIG.endpoints.auth.criarAdmin}`;
    console.log('AuthService - Criando admin:', criarAdminUrl);
    console.log('AuthService - Dados do admin:', adminData);
    
    return this.http.post(criarAdminUrl, adminData);
  }
}
