import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ClienteService } from './cliente.service';
import { TemaFestaService } from './tema-festa.service';
import { Cliente } from '../models/cliente.model';
import { TemaFesta } from '../models/tema-festa.model';

export interface ResultadoBusca {
  tipo: 'cliente' | 'tema';
  item: Cliente | TemaFesta;
  titulo: string;
  subtitulo?: string;
  rota: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuscaService {

  constructor(
    private clienteService: ClienteService,
    private temaFestaService: TemaFestaService
  ) {}

  buscar(termo: string): Observable<ResultadoBusca[]> {
    if (!termo || termo.trim().length < 2) {
      return of([]);
    }

    const termoLower = termo.toLowerCase().trim();

    return forkJoin({
      clientes: this.clienteService.buscarTodos().pipe(
        catchError(() => of([]))
      ),
      temas: this.temaFestaService.buscarTodos().pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(({ clientes, temas }) => {
        const resultados: ResultadoBusca[] = [];

        // Buscar clientes
        clientes.forEach((cliente: Cliente) => {
          const nomeMatch = cliente.nome?.toLowerCase().includes(termoLower);
          const emailMatch = cliente.email?.toLowerCase().includes(termoLower);
          const telefoneMatch = cliente.telefone?.includes(termo);

          if (nomeMatch || emailMatch || telefoneMatch) {
            resultados.push({
              tipo: 'cliente',
              item: cliente,
              titulo: cliente.nome || 'Cliente sem nome',
              subtitulo: cliente.email || cliente.telefone,
              rota: `/clientes/editar/${cliente.id}`
            });
          }
        });

        // Buscar temas
        temas.forEach((tema: TemaFesta) => {
          const nomeMatch = tema.nome?.toLowerCase().includes(termoLower);
          const descricaoMatch = tema.descricao?.toLowerCase().includes(termoLower);

          if (nomeMatch || descricaoMatch) {
            resultados.push({
              tipo: 'tema',
              item: tema,
              titulo: tema.nome || 'Tema sem nome',
              subtitulo: tema.descricao,
              rota: `/temas/editar/${tema.id}`
            });
          }
        });

        return resultados.slice(0, 8);
      })
    );
  }
}

