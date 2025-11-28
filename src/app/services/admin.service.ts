import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioListResponse, PromoverResponse } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly baseUrl = environment.SERVIDOR + '/api/admin';

    constructor(private http: HttpClient) {
        console.log('=== ADMIN SERVICE INICIALIZADO ===');
        console.log('Base URL:', this.baseUrl);
    }

    /**
     * Lista todos os usuários do sistema
     * Requer: ROLE_ADMIN
     */
    listarUsuarios(): Observable<UsuarioListResponse[]> {
        const url = `${this.baseUrl}/usuarios`;
        console.log('Listando usuários:', url);

        return this.http.get<UsuarioListResponse[]>(url).pipe(
            tap({
                next: (usuarios) => {
                    console.log(`✅ ${usuarios.length} usuários carregados`);
                    console.log('Usuários:', usuarios);
                },
                error: (error) => {
                    console.error('❌ Erro ao listar usuários:', error);
                    if (error.status === 403) {
                        console.error('Acesso negado. Usuário não tem ROLE_ADMIN');
                    }
                }
            })
        );
    }

    /**
     * Promove um usuário para ROLE_ADMIN
     * Requer: ROLE_ADMIN
     */
    promoverAdmin(id: number): Observable<PromoverResponse> {
        const url = `${this.baseUrl}/usuarios/${id}/promover-admin`;
        console.log('Promovendo usuário:', id, 'URL:', url);

        return this.http.post<PromoverResponse>(url, {}).pipe(
            tap({
                next: (response) => {
                    console.log('✅ Usuário promovido:', response);
                },
                error: (error) => {
                    console.error('❌ Erro ao promover usuário:', error);
                    if (error.status === 400) {
                        console.error('Usuário não encontrado ou já é admin');
                    } else if (error.status === 403) {
                        console.error('Acesso negado. Usuário não tem ROLE_ADMIN');
                    }
                }
            })
        );
    }

    /**
     * Remove ROLE_ADMIN de um usuário
     * Requer: ROLE_ADMIN
     */
    removerAdmin(id: number): Observable<PromoverResponse> {
        const url = `${this.baseUrl}/usuarios/${id}/remover-admin`;
        console.log('Removendo admin de usuário:', id, 'URL:', url);

        return this.http.delete<PromoverResponse>(url).pipe(
            tap({
                next: (response) => {
                    console.log('✅ ROLE_ADMIN removida:', response);
                },
                error: (error) => {
                    console.error('❌ Erro ao remover admin:', error);
                    if (error.status === 400) {
                        console.error('Usuário não encontrado');
                    } else if (error.status === 403) {
                        console.error('Acesso negado. Usuário não tem ROLE_ADMIN');
                    }
                }
            })
        );
    }
}
