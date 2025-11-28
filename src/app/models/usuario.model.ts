export interface Usuario {
  id?: number;
  email: string;
  senha?: string; // Senha opcional após login
  nome?: string;
  role?: string; // Deprecated - manter para compatibilidade
  roles?: string[]; // Array de roles (ROLE_USER, ROLE_ADMIN)
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token?: string;
  usuario: Usuario;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
}

// Interfaces para Admin API
export interface UsuarioListResponse {
  id: number;
  email: string;
  roles: string[];
}

export interface PromoverResponse {
  message: string;
  email: string;
  roles: string[];
}

