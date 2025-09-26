import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemaFestaService } from '../../../services/tema-festa.service';
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
  loading = false;

  constructor(private temaService: TemaFestaService) { }

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
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar temas',
          text: 'Não foi possível conectar ao backend. Verifique se o servidor está rodando.'
        });
      }
    });
  }

  filtrarTemas() {
    if (!this.termoBusca.trim()) {
      this.temasFiltrados = this.temas;
      return;
    }

    this.temasFiltrados = this.temas.filter(tema =>
      tema.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      (tema.descricao && tema.descricao.toLowerCase().includes(this.termoBusca.toLowerCase()))
    );
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
            Swal.fire('Excluído!', 'Tema excluído com sucesso.', 'success');
            this.carregarTemas();
          },
          error: (error) => {
            console.error('Erro ao excluir tema:', error);
            Swal.fire('Erro!', 'Não foi possível excluir o tema.', 'error');
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
        Swal.fire('Sucesso!', `Tema ${tema.ativo ? 'ativado' : 'desativado'} com sucesso.`, 'success');
      },
      error: (error) => {
        console.error('Erro ao atualizar tema:', error);
        Swal.fire('Erro!', 'Não foi possível atualizar o tema.', 'error');
      }
    });
  }
}

