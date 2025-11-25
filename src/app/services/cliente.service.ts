import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  API = environment.SERVIDOR + '/api/clientes';

  constructor(private http: HttpClient) { }

  buscarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(this.API + '/' + id);
  }

  salvar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, cliente);
  }

  atualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.API + '/' + id, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }

  buscarPorNome(nome: string): Observable<Cliente[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Cliente[]>(this.API + '/buscar', { params });
  }

  buscarPorTelefone(telefone: string): Observable<Cliente[]> {
    const params = new HttpParams().set('telefone', telefone);
    return this.http.get<Cliente[]>(this.API + '/telefone', { params });
  }

  buscarPorStatus(status: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API + '/status/' + status);
  }
}
