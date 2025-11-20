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

  const theme = async (themeData: ThemeRequest): Promise<ThemeResponse> => {
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
        throw new Error("Falha ao gerar tema");
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

  return { theme, loading, error };
};