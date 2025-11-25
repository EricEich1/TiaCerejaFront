import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemaFestaService } from '../../../services/tema-festa.service';
import { TemaFesta, TemaFestaRequest } from '../../../models/tema-festa.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tema-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './tema-form.component.html',
  styleUrl: './tema-form.component.scss'
})
export class TemaFormComponent implements OnInit {
  tema: TemaFestaRequest = {
    nome: '',
    descricao: '',
    corPrincipal: '#667eea',
    corSecundaria: '#764ba2',
    ativo: true,
    precoBase: undefined
  };

  isEdit = false;
  loading = false;
  temaId?: number;

  constructor(
    private temaService: TemaFestaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.temaId = this.route.snapshot.params['id'];
    this.isEdit = !!this.temaId;
    
    if (this.isEdit && this.temaId) {
      this.carregarTema();
    }
  }

  carregarTema() {
    this.loading = true;
    this.temaService.buscarPorId(this.temaId!).subscribe({
      next: (tema) => {
        this.tema = {
          nome: tema.nome,
          descricao: tema.descricao || '',
          corPrincipal: tema.corPrincipal,
          corSecundaria: tema.corSecundaria || '',
          ativo: tema.ativo,
          precoBase: tema.precoBase || 0
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tema:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar tema',
          text: 'Não foi possível carregar os dados do tema.'
        });
      }
    });
  }

  salvar() {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;

    if (this.isEdit && this.temaId) {
      this.temaService.atualizar(this.temaId, this.tema).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Tema atualizado com sucesso!',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/temas']);
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar tema:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar tema',
            text: 'Não foi possível atualizar o tema. Tente novamente.'
          });
        }
      });
    } else {
      this.temaService.salvar(this.tema).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Tema cadastrado com sucesso!',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/temas']);
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao salvar tema:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao salvar tema',
            text: 'Não foi possível salvar o tema. Tente novamente.'
          });
        }
      });
    }
  }

  onColorChange() {
    // Método para atualizar preview quando cores mudam
  }

  validarFormulario(): boolean {
    if (!this.tema.nome.trim()) {
      Swal.fire('Atenção!', 'Nome do tema é obrigatório.', 'warning');
      return false;
    }

    if (!this.tema.corPrincipal.trim()) {
      Swal.fire('Atenção!', 'Cor principal é obrigatória.', 'warning');
      return false;
    }

    return true;
  }

  cancelar() {
    this.router.navigate(['/temas']);
  }
}

