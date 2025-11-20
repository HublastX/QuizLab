"use client";

import { useState } from "react";
import { getApiUrl } from "@/lib/api";

interface SubTopicRequest {
  sub_topic: string;
  description: string;
  theme_id: string;
}

interface SubTopicResponse {
  id: string;
  sub_topic: string;
  description: string;
  theme_id: string;
  created_at: string;
  updated_at: string;
}

export const useTopics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // POST /sub-topics - Criar novo subtópico
  const postSubTopic = async (subTopicData: SubTopicRequest): Promise<SubTopicResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl('/sub-topics'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(subTopicData),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao criar subtópico");
      }
      
      const data: SubTopicResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET /sub-topics/{sub_topic_id} - Buscar subtópico por ID
  const getSubTopicById = async (subTopicId: string): Promise<SubTopicResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`/sub-topics/${subTopicId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Falha ao buscar subtópico");
      }
      
      const data: SubTopicResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GET /sub-topics/theme/{theme_id} - Buscar subtópicos por theme_id
  const getSubTopicsByThemeId = async (themeId: string): Promise<SubTopicResponse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`/sub-topics/theme/${themeId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Falha ao buscar subtópicos do tema");
      }
      
      const data: SubTopicResponse[] = await response.json();
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
    postSubTopic, 
    getSubTopicById, 
    getSubTopicsByThemeId, 
    loading, 
    error 
  };
};