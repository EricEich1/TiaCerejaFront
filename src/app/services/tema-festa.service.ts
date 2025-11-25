import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TemaFesta, TemaFestaRequest } from '../models/tema-festa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemaFestaService {
  API = environment.SERVIDOR + '/api/temas';

  constructor(private http: HttpClient) { }

  buscarTodos(): Observable<TemaFesta[]> {
    return this.http.get<TemaFesta[]>(this.API);
  }

  buscarPorId(id: number): Observable<TemaFesta> {
    return this.http.get<TemaFesta>(this.API + '/' + id);
  }

  salvar(tema: TemaFestaRequest): Observable<TemaFesta> {
    return this.http.post<TemaFesta>(this.API, tema);
  }

  atualizar(id: number, tema: TemaFestaRequest): Observable<TemaFesta> {
    return this.http.put<TemaFesta>(this.API + '/' + id, tema);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }

  buscar(nome?: string): Observable<TemaFesta[]> {
    const params = nome ? '?nome=' + nome : '';
    return this.http.get<TemaFesta[]>(this.API + '/buscar' + params);
  }

  buscarAtivos(): Observable<TemaFesta[]> {
    return this.http.get<TemaFesta[]>(this.API + '/ativos');
  }
}