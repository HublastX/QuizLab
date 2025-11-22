"use client";

import { useState } from "react";
import {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionsResponse,
  UseQuestionReturn,
} from "@/util/types/question";
import { BASE_PATH } from "@/lib/constants";

export const useQuestion = (): UseQuestionReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
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

    console.log("🔍 [QUESTION FETCH]", options.method || "GET", fullUrl);
    
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

  const getQuestionById = async (questionId: string): Promise<Question> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/questions/${questionId}`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar question";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getQuestionsBySubTopic = async (subTopicId: string): Promise<Question[]> => {
    setLoading(true);
    setError(null);

    try {
      const data: QuestionsResponse = await fetchWithAuth(`/api/questions/sub-topic/${subTopicId}`);
      setQuestions(data.questions);
      return data.questions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar questions";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: CreateQuestionRequest): Promise<Question> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth("/api/questions", {
        method: "POST",
        body: JSON.stringify(questionData),
      });
      
      setQuestions((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar question";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (questionId: string, questionData: UpdateQuestionRequest): Promise<Question> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/questions/${questionId}`, {
        method: "PATCH",
        body: JSON.stringify(questionData),
      });
      
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? data : q)));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar question";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      return data.message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar question";
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
    questions,
    loading,
    error,
    getQuestionById,
    getQuestionsBySubTopic,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    clearError,
  };
};