import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoEvento, TipoEventoRequest } from '../models/tipo-evento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  API = environment.SERVIDOR + '/api/tipos-evento';

  constructor(private http: HttpClient) { }

  buscarTodos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(this.API);
  }

  buscarPorId(id: number): Observable<TipoEvento> {
    return this.http.get<TipoEvento>(this.API + '/' + id);
  }

  salvar(tipoEvento: TipoEventoRequest): Observable<TipoEvento> {
    return this.http.post<TipoEvento>(this.API, tipoEvento);
  }

  atualizar(id: number, tipoEvento: TipoEventoRequest): Observable<TipoEvento> {
    return this.http.put<TipoEvento>(this.API + '/' + id, tipoEvento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }

  buscar(nome?: string): Observable<TipoEvento[]> {
    const params = nome ? '?nome=' + nome : '';
    return this.http.get<TipoEvento[]>(this.API + '/buscar' + params);
  }

  buscarPorCapacidade(capacidade: number): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(this.API + '/capacidade/' + capacidade);
  }
}