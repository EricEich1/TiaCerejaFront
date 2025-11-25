import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco, EnderecoRequest } from '../models/endereco.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  API = environment.SERVIDOR + '/api/enderecos';

  constructor(private http: HttpClient) { }

  buscarTodos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.API);
  }

  buscarPorId(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(this.API + '/' + id);
  }

  salvar(endereco: EnderecoRequest): Observable<Endereco> {
    console.log('Enviando endereço:', endereco);
    return this.http.post<Endereco>(this.API, endereco);
  }

  atualizar(id: number, endereco: EnderecoRequest): Observable<Endereco> {
    return this.http.put<Endereco>(this.API + '/' + id, endereco);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }

  buscarPorCidade(cidade: string): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.API + '/cidade?cidade=' + cidade);
  }

  buscarPorEstado(estado: string): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.API + '/estado/' + estado);
  }
}