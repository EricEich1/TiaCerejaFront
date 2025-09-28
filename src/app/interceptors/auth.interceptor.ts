import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();
        const isApiUrl = request.url.startsWith('http://localhost:8081/api/');

        // Só adiciona o token se a requisição for para a nossa API e não for para o login/registro
        if (token && isApiUrl && !request.url.includes('/auth/')) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }

        return next.handle(request);
    }
}