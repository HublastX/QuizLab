"use client";

import { useState } from "react";
import { Theme, CreateThemeRequest, UseThemeReturn } from "@/util/types/theme";
import { BASE_PATH } from "@/lib/constants";

export const useTheme = (): UseThemeReturn => {
  const [themes, setThemes] = useState<Theme[]>([]);
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

    console.log("🔍 [THEME FETCH]", options.method || "GET", fullUrl);
    
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

  const getThemes = async (): Promise<Theme[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/api/themes");
      setThemes(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar themes";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getThemeById = async (themeId: string): Promise<Theme> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/themes/${themeId}`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar theme";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTheme = async (themeData: CreateThemeRequest): Promise<Theme> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/api/themes", {
        method: "POST",
        body: JSON.stringify(themeData),
      });
      
      setThemes((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar theme";
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
    themes,
    loading,
    error,
    getThemes,
    getThemeById,
    createTheme,
    clearError,
  };
};