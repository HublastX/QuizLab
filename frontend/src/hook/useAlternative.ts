"use client";

import { useState } from "react";
import {
  Alternative,
  CreateAlternativeRequest,
  UpdateAlternativeRequest,
  UseAlternativeReturn,
} from "@/util/types/alternative";
import { BASE_PATH } from "@/lib/constants";

export const useAlternative = (): UseAlternativeReturn => {
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
    if (!token) throw new Error("Usuário não autenticado");

    const fullUrl = url.startsWith("/api") ? `${BASE_PATH}${url}` : url;
    
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      },
    };

    console.log("🔍 [ALTERNATIVE FETCH]", options.method || "GET", fullUrl);
    
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

  const createAlternative = async (
    questionId: string,
    alternativeData: CreateAlternativeRequest
  ): Promise<Alternative> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/alternatives/${questionId}`, {
        method: "POST",
        body: JSON.stringify(alternativeData),
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar alternative";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlternative = async (
    alternativeId: string,
    alternativeData: UpdateAlternativeRequest
  ): Promise<Alternative> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/alternatives/edit/${alternativeId}`, {
        method: "PATCH",
        body: JSON.stringify(alternativeData),
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar alternative";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlternative = async (alternativeId: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/alternatives/edit/${alternativeId}`, {
        method: "DELETE",
      });
      return data.message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar alternative";
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
    createAlternative,
    updateAlternative,
    deleteAlternative,
    clearError,
  };
};