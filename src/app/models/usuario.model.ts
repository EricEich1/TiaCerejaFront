export interface Usuario {
  id?: number;
  email: string;
  senha?: string; // Senha opcional após login
  nome?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token?: string;
  usuario: Usuario;
  message?: string;
}

