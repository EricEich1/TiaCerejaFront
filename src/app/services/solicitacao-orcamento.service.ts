import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitacaoOrcamento } from '../models/solicitacao-orcamento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoOrcamentoService {
  API = environment.SERVIDOR + '/api/solicitacoes';

  constructor(private http: HttpClient) { }

  buscarTodos(): Observable<SolicitacaoOrcamento[]> {
    return this.http.get<SolicitacaoOrcamento[]>(this.API);
  }

  buscarPorId(id: number): Observable<SolicitacaoOrcamento> {
    return this.http.get<SolicitacaoOrcamento>(this.API + '/' + id);
  }

  salvar(solicitacao: SolicitacaoOrcamento): Observable<SolicitacaoOrcamento> {
    return this.http.post<SolicitacaoOrcamento>(this.API, solicitacao);
  }

  atualizar(id: number, solicitacao: SolicitacaoOrcamento): Observable<SolicitacaoOrcamento> {
    return this.http.put<SolicitacaoOrcamento>(this.API + '/' + id, solicitacao);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(this.API + '/' + id);
  }

  buscarPorStatus(status: string): Observable<SolicitacaoOrcamento[]> {
    return this.http.get<SolicitacaoOrcamento[]>(this.API + '/status/' + status);
  }

  buscarPorCliente(clienteId: number): Observable<SolicitacaoOrcamento[]> {
    return this.http.get<SolicitacaoOrcamento[]>(this.API + '/cliente/' + clienteId);
  }
}
