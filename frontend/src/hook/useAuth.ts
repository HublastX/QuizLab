"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RegisterResponse,
  UseAuthReturn,
} from "@/util/types/auth";

const BASE_PATH = "/quiz-lab";

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithoutAuth = async (url: string, options: RequestInit = {}) => {
    // Adiciona o basePath na URL para rotas internas da API
    const fullUrl = url.startsWith("/api") ? `${BASE_PATH}${url}` : url;
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    console.log("🔍 [FETCH] URL original:", url);
    console.log("🔍 [FETCH] URL com basePath:", fullUrl);
    
    const response = await fetch(fullUrl, config);
    
    console.log("🔍 [FETCH] Status:", response.status);
    
    // Lê o corpo uma única vez
    const responseText = await response.text();
    let data;
    
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { error: responseText || "Erro na requisição" };
    }

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Erro ${response.status}: ${response.statusText}`
      );
    }

    return data;
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithoutAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (data.access_token || data.token) {
        const token = data.access_token || data.token;
        localStorage.setItem("access_token", token);
      }

      router.push("/home");
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithoutAuth("/api/auth/registro", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      router.push("/login");
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer registro";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    loading,
    error,
    login,
    register,
    clearError,
  };
};