"use client";

import { useState } from "react";
import { User, UseUserReturn } from "@/util/types/user";
import { BASE_PATH } from "@/lib/constants";

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const fullUrl = url.startsWith("/api") ? `${BASE_PATH}${url}` : url;
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
    };

    console.log("🔍 [USER FETCH]", options.method || "GET", fullUrl);
    
    const response = await fetch(fullUrl, config);
    const responseText = await response.text();
    
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { error: responseText || "Erro na requisição" };
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `Erro ${response.status}`);
    }

    return data;
  };

  const getMe = async (): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/api/users/me");
      setUser(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar usuário";
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
    user,
    loading,
    error,
    getMe,
    clearError,
  };
};