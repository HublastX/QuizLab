"use client";

import { useState } from "react";
import { SubTopic, CreateSubTopicRequest, UseSubTopicReturn } from "@/util/types/subTopic";
import { BASE_PATH } from "@/lib/constants";

export const useSubTopic = (): UseSubTopicReturn => {
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
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

    console.log("🔍 [SUBTOPIC FETCH]", options.method || "GET", fullUrl);
    
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

  const getSubTopicById = async (subTopicId: string): Promise<SubTopic> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/sub-topics/${subTopicId}`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar sub-topic";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSubTopicsByTheme = async (themeId: string): Promise<SubTopic[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/sub-topics/theme/${themeId}`);
      setSubTopics(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar sub-topics";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSubTopic = async (subTopicData: CreateSubTopicRequest): Promise<SubTopic> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/api/sub-topics", {
        method: "POST",
        body: JSON.stringify(subTopicData),
      });
      
      setSubTopics((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar sub-topic";
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
    subTopics,
    loading,
    error,
    getSubTopicById,
    getSubTopicsByTheme,
    createSubTopic,
    clearError,
  };
};