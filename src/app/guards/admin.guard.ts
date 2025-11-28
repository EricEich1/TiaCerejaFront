import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        // Verificar se está autenticado
        if (!this.authService.getToken()) {
            console.log('AdminGuard - Usuário não autenticado, redirecionando para login');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Obter usuário atual
        const usuario = this.authService.getCurrentUserValue();

        if (!usuario) {
            console.log('AdminGuard - Dados do usuário não encontrados, redirecionando para login');
            this.authService.logout();
            this.router.navigate(['/login']);
            return false;
        }

        // Verificar se tem ROLE_ADMIN
        const isAdmin = this.hasAdminRole(usuario.roles || []);

        if (!isAdmin) {
            console.log('AdminGuard - Usuário sem ROLE_ADMIN, acesso negado');
            console.log('Roles do usuário:', usuario.roles);

            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado',
                text: 'Apenas administradores podem acessar esta página.',
                confirmButtonColor: '#d33'
            });

            this.router.navigate(['/dashboard']);
            return false;
        }

        console.log('AdminGuard - Usuário tem ROLE_ADMIN, acesso permitido');
        return true;
    }

    /**
     * Verifica se o usuário tem ROLE_ADMIN
     */
    private hasAdminRole(roles: string[]): boolean {
        return roles.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');
    }
}
