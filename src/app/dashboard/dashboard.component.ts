import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { EnderecoService } from '../services/endereco.service';
import { TemaFestaService } from '../services/tema-festa.service';
import { TipoEventoService } from '../services/tipo-evento.service';
import { NotificationService } from '../services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = {
    clientes: 0,
    solicitacoes: 0,
    temas: 0,
    tiposEvento: 0
  };

  constructor(
    private clienteService: ClienteService,
    private enderecoService: EnderecoService,
    private temaFestaService: TemaFestaService,
    private tipoEventoService: TipoEventoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Carregar dados reais dos serviços
    this.clienteService.buscarTodos().subscribe({
      next: (clientes) => {
        this.stats.clientes = clientes.length;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.stats.clientes = 0;
        this.notificationService.warning('Aviso', 'Não foi possível carregar todos os dados do dashboard.');
      }
    });

    this.enderecoService.buscarTodos().subscribe({
      next: (enderecos) => {
        // Endereços não são solicitacoes, mas vamos usar como exemplo
        this.stats.solicitacoes = enderecos.length;
      },
      error: (error) => {
        console.error('Erro ao carregar endereços:', error);
        this.stats.solicitacoes = 0;
      }
    });

    this.temaFestaService.buscarTodos().subscribe({
      next: (temas) => {
        this.stats.temas = temas.length;
      },
      error: (error) => {
        console.error('Erro ao carregar temas:', error);
        this.stats.temas = 0;
      }
    });

    this.tipoEventoService.buscarTodos().subscribe({
      next: (tiposEvento) => {
        this.stats.tiposEvento = tiposEvento.length;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de evento:', error);
        this.stats.tiposEvento = 0;
      }
    });
  }

  showComingSoon(feature: string) {
    Swal.fire({
      icon: 'info',
      title: 'Em breve!',
      text: `A funcionalidade "${feature}" estará disponível em breve.`,
      confirmButtonText: 'Entendi',
      confirmButtonColor: '#667eea'
    });
  }
}
