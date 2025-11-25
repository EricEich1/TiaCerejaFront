import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      validate: '/api/auth/validate',
      criarAdmin: '/api/auth/criar-admin'
    },
    usuarios: '/api/usuarios',
    clientes: '/api/clientes',
    enderecos: '/api/enderecos',
    solicitacoes: '/api/solicitacoes',
    temas: '/api/temas',
    tiposEvento: '/api/tipos-evento'
  }
};
