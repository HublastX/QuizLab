export interface LoginCredentials {
    email: string;
    password: string;
  }
  
export interface AuthResponse {
    token?: string;
    user?: string;
    message?: string;
    access_token?: string;
  }

  export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UseAuthReturn {
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<RegisterResponse>;
    clearError: () => void;
}