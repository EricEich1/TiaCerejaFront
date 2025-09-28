export const API_CONFIG = {
  baseUrl: 'http://localhost:8081',
  endpoints: {
    // Autenticação
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      validate: '/api/auth/validate',
      criarAdmin: '/api/auth/criar-admin'
    },
    // Usuários
    usuarios: '/api/usuarios',
    // Outros endpoints
    clientes: '/api/clientes',
    enderecos: '/api/enderecos',
    solicitacoes: '/api/solicitacoes',
    temas: '/api/temas',
    tiposEvento: '/api/tipos-evento'
  }
};
