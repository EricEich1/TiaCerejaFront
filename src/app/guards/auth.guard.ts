import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificação simples para desenvolvimento
    if (!this.authService.getToken() || !this.authService.isLoggedIn()) {
      console.log('AuthGuard - Usuário não autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('AuthGuard - Usuário autenticado, permitindo acesso');
    return true;
    
    // TODO: Reativar validação de token quando o backend estiver estável
    /*
    // Validar token com o backend
    return this.authService.validateToken().pipe(
      map(() => {
        console.log('AuthGuard - Token válido');
        return true;
      }),
      catchError((error) => {
        console.error('AuthGuard - Token inválido:', error);
        this.authService.logout().subscribe();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
    */
  }
}
