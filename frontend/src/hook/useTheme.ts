"use client";

import { useState } from "react";
import { getApiUrl } from "@/lib/api";

interface ThemeRequest {
  title: string;
  description: string;
}

interface ThemeResponse {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTheme = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postTheme = async (themeData: ThemeRequest): Promise<ThemeResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl('/themes'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(themeData),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao criar tema");
      }
      
      const data: ThemeResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getThemes = async (): Promise<ThemeResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl('/themes'), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Falha ao buscar temas");
      }
      
      const data: ThemeResponse[] = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getThemeById = async (themeId: string): Promise<ThemeResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`/themes/${themeId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Falha ao buscar tema");
      }
      
      const data: ThemeResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    postTheme, 
    getThemes, 
    getThemeById, 
    loading, 
    error 
  };
};