import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioListResponse } from '../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-usuario-management',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './usuario-management.component.html',
    styleUrls: ['./usuario-management.component.scss']
})
export class UsuarioManagementComponent implements OnInit {
    usuarios: UsuarioListResponse[] = [];
    loading = false;
    currentUserEmail: string = '';

    constructor(
        private adminService: AdminService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.carregarUsuarios();
        const currentUser = this.authService.getCurrentUserValue();
        if (currentUser) {
            this.currentUserEmail = currentUser.email;
        }
    }

    carregarUsuarios(): void {
        this.loading = true;
        this.adminService.listarUsuarios().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar usuários', error);
                this.loading = false;
                Swal.fire('Erro', 'Não foi possível carregar a lista de usuários.', 'error');
            }
        });
    }

    hasAdminRole(roles: string[]): boolean {
        return roles && roles.some(role => role === 'ROLE_ADMIN' || role === 'ADMIN');
    }

    promoverAdmin(usuario: UsuarioListResponse): void {
        Swal.fire({
            title: 'Promover a Admin?',
            text: `Deseja conceder privilégios de administrador para ${usuario.email}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754', // success color
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, promover!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.adminService.promoverAdmin(usuario.id).subscribe({
                    next: (response) => {
                        this.loading = false;
                        Swal.fire('Sucesso!', `Usuário ${usuario.email} agora é um administrador.`, 'success');
                        this.carregarUsuarios(); // Recarrega a lista
                    },
                    error: (error) => {
                        this.loading = false;
                        console.error('Erro ao promover', error);
                        Swal.fire('Erro', 'Falha ao promover usuário. Verifique se você tem permissão.', 'error');
                    }
                });
            }
        });
    }

    removerAdmin(usuario: UsuarioListResponse): void {
        // Evitar que o admin remova a si mesmo se for o único (lógica básica, idealmente validada no backend)
        if (usuario.email === this.currentUserEmail) {
            Swal.fire({
                title: 'Cuidado!',
                text: 'Você está prestes a remover seus próprios privilégios de administrador. Tem certeza?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sim, remover meus privilégios',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.executarRemocaoAdmin(usuario);
                }
            });
        } else {
            Swal.fire({
                title: 'Remover Admin?',
                text: `Deseja revogar os privilégios de administrador de ${usuario.email}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545', // danger color
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sim, remover!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.executarRemocaoAdmin(usuario);
                }
            });
        }
    }

    private executarRemocaoAdmin(usuario: UsuarioListResponse): void {
        this.loading = true;
        this.adminService.removerAdmin(usuario.id).subscribe({
            next: (response) => {
                this.loading = false;
                Swal.fire('Sucesso!', `Privilégios de admin removidos de ${usuario.email}.`, 'success');
                this.carregarUsuarios();

                // Se removeu o próprio admin, talvez precise fazer logout ou redirecionar
                if (usuario.email === this.currentUserEmail) {
                    // Opcional: forçar logout ou recarregar página para atualizar permissões
                    // this.authService.logout();
                }
            },
            error: (error) => {
                this.loading = false;
                console.error('Erro ao remover admin', error);
                Swal.fire('Erro', 'Falha ao remover privilégios.', 'error');
            }
        });
    }
}
