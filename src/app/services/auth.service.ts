import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/usuario.model';
import { API_CONFIG } from '../shared/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = `${API_CONFIG.baseUrl}/api/auth/login`;
  private readonly registerUrl = `${API_CONFIG.baseUrl}/api/auth/registrar`;

  // Este BehaviorSubject vai "transmitir" o status de login para quem quiser ouvir (como a Navbar)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true); // Avisa que o login foi feito com sucesso
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false); // Avisa que o logout foi feito
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // A Navbar vai "ouvir" este Observable para saber se mostra "Login" ou "Logout"
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}