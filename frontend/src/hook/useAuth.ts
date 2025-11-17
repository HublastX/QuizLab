import { useState } from 'react';
import { LoginCredentials, AuthResponse } from './../util/types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};