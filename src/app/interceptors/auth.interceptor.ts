import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();
        const isApiUrl = request.url.startsWith(environment.SERVIDOR + '/api/');
        const isAuthRequest = request.url.includes('/auth/');

        // Log para debug
        if (isAuthRequest) {
            console.log('=== INTERCEPTOR - Requisição de Autenticação ===');
            console.log('URL:', request.url);
            console.log('Método:', request.method);
            console.log('Headers originais:', Array.from(request.headers.keys()));
            console.log('Token presente:', !!token);
            console.log('Environment SERVIDOR:', environment.SERVIDOR);
            console.log('É requisição de API:', isApiUrl);
            console.log('Vai adicionar token?', token && isApiUrl && !isAuthRequest);
        }

        // Para requisições de autenticação, NÃO adiciona token e passa direto
        // Isso é importante para login e registro funcionarem
        if (isAuthRequest) {
            console.log('✅ Interceptor: Passando requisição de auth sem modificar');
            return next.handle(request);
        }

        // Só adiciona o token se a requisição for para a nossa API e não for para o login/registro
        if (token && isApiUrl && !isAuthRequest) {
            console.log('✅ Interceptor: Adicionando token de autorização');
            const cloned = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }

        // Para outras requisições, passa direto
        return next.handle(request);
    }
}