import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemaFestaService } from '../../../services/tema-festa.service';
import { NotificationService } from '../../../services/notification.service';
import { TemaFesta } from '../../../models/tema-festa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tema-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tema-list.component.html',
  styleUrl: './tema-list.component.scss'
})
export class TemaListComponent implements OnInit {
  temas: TemaFesta[] = [];
  temasFiltrados: TemaFesta[] = [];
  termoBusca = '';
  filtroStatus: 'todos' | 'ativo' | 'inativo' = 'todos';
  ordenacao: 'nome' | 'preco' | 'data' = 'nome';
  loading = false;

  constructor(
    private temaService: TemaFestaService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.carregarTemas();
  }

  carregarTemas() {
    this.loading = true;
    this.temaService.buscarTodos().subscribe({
      next: (temas) => {
        this.temas = temas;
        this.temasFiltrados = temas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar temas:', error);
        this.loading = false;
        this.notificationService.error(
          'Erro ao carregar temas',
          'Não foi possível conectar ao backend. Verifique se o servidor está rodando.'
        );
      }
    });
  }

  filtrarTemas() {
    let filtrados = [...this.temas];

    // Filtro por busca de texto
    if (this.termoBusca.trim()) {
      filtrados = filtrados.filter(tema =>
        tema.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        (tema.descricao && tema.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()))
      );
    }

    // Filtro por status
    if (this.filtroStatus !== 'todos') {
      filtrados = filtrados.filter(tema =>
        this.filtroStatus === 'ativo' ? tema.ativo : !tema.ativo
      );
    }

    // Ordenação
    filtrados.sort((a, b) => {
      switch (this.ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'preco':
          const precoA = a.precoBase || 0;
          const precoB = b.precoBase || 0;
          return precoB - precoA;
        default:
          return 0;
      }
    });

    this.temasFiltrados = filtrados;
  }

  excluirTema(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.temaService.excluir(id).subscribe({
          next: () => {
            this.notificationService.success('Tema excluído!', 'O tema foi removido com sucesso.');
            this.carregarTemas();
          },
          error: (error) => {
            console.error('Erro ao excluir tema:', error);
            this.notificationService.error('Erro!', 'Não foi possível excluir o tema.');
          }
        });
      }
    });
  }

  toggleAtivo(tema: TemaFesta) {
    const temaAtualizado = { ...tema, ativo: !tema.ativo };
    this.temaService.atualizar(tema.id!, temaAtualizado).subscribe({
      next: () => {
        tema.ativo = !tema.ativo;
        this.notificationService.success(
          'Status atualizado!',
          `Tema ${tema.ativo ? 'ativado' : 'desativado'} com sucesso.`
        );
        this.filtrarTemas();
      },
      error: (error) => {
        console.error('Erro ao atualizar tema:', error);
        this.notificationService.error('Erro!', 'Não foi possível atualizar o tema.');
      }
    });
  }

  limparFiltros() {
    this.termoBusca = '';
    this.filtroStatus = 'todos';
    this.ordenacao = 'nome';
    this.filtrarTemas();
  }

  getTemasAtivos(): number {
    return this.temas.filter(t => t.ativo).length;
  }

  getTemasInativos(): number {
    return this.temas.filter(t => !t.ativo).length;
  }
}

