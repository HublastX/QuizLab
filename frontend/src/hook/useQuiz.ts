"use client";

import { useState } from "react";
import {
  QuizResponse,
  CreateQuizTextRequest,
  CreateQuizFileRequest,
  UseQuizReturn,
} from "@/util/types/quiz";
import { BASE_PATH } from "@/lib/constants";

export const useQuiz = (): UseQuizReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  // Para requisições JSON (texto)
  const fetchJsonWithAuth = async (url: string, body: object) => {
    const token = getToken();
    if (!token) throw new Error("Usuário não autenticado");

    const fullUrl = url.startsWith("/api") ? `${BASE_PATH}${url}` : url;
    console.log("🔍 [QUIZ FETCH JSON]", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

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

  // Para requisições FormData (arquivos)
  const fetchFormDataWithAuth = async (url: string, formData: FormData) => {
    const token = getToken();
    if (!token) throw new Error("Usuário não autenticado");

    const fullUrl = url.startsWith("/api") ? `${BASE_PATH}${url}` : url;
    console.log("🔍 [QUIZ FETCH FORMDATA]", fullUrl);
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // NÃO definir Content-Type para FormData
      },
      body: formData,
    });

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

  const createQuizFromText = async (quizData: CreateQuizTextRequest): Promise<QuizResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchJsonWithAuth("/api/quiz/text", quizData);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar quiz";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuizFromDocument = async (quizData: CreateQuizFileRequest): Promise<QuizResponse> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("document", quizData.file);
      formData.append("theme_id", quizData.theme_id);
      formData.append("sub_topic_id", quizData.sub_topic_id);
      if (quizData.num_questions) formData.append("num_questions", quizData.num_questions.toString());
      if (quizData.num_alternatives) formData.append("num_alternatives", quizData.num_alternatives.toString());

      const data = await fetchFormDataWithAuth("/api/quiz/document", formData);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar quiz";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createQuizFromAudio = async (quizData: CreateQuizFileRequest): Promise<QuizResponse> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", quizData.file);
      formData.append("theme_id", quizData.theme_id);
      formData.append("sub_topic_id", quizData.sub_topic_id);
      if (quizData.num_questions) formData.append("num_questions", quizData.num_questions.toString());
      if (quizData.num_alternatives) formData.append("num_alternatives", quizData.num_alternatives.toString());

      const data = await fetchFormDataWithAuth("/api/quiz/audio", formData);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar quiz";
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
    createQuizFromText,
    createQuizFromDocument,
    createQuizFromAudio,
    clearError,
  };
};