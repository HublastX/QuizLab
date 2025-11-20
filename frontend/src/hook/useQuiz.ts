"use client";

import { useState } from "react";
import { getApiUrl } from "@/lib/api";

interface QuizParams {
    text: string;
    theme_id: string;
    sub_topic_id: string;
    num_questions?: number;
    num_alternatives?: number;
}

interface Alternativa {
    letra: string;
    texto: string;
    correta: boolean;
    explicacao: string;
}

interface Pergunta {
    pergunta: string;
    alternativas: Alternativa[];
}

interface QuizResponse {
    perguntas: Pergunta[];
}

export const useQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<QuizResponse | null>(null);

    const quizText = async (params: QuizParams) => {
        setLoading(true);
        setError(null);
        setData(null);
        
        try {
            const formData = new URLSearchParams();
            formData.append('text', params.text);
            formData.append('theme_id', params.theme_id);
            formData.append('sub_topic_id', params.sub_topic_id);
            
            if (params.num_questions) {
                formData.append('num_questions', params.num_questions.toString());
            }
            
            if (params.num_alternatives) {
                formData.append('num_alternatives', params.num_alternatives.toString());
            }

            const response = await fetch(getApiUrl('/quiz/text'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error("Falha ao gerar quiz");
            }
            
            const responseData: QuizResponse = await response.json();
            setData(responseData);
            return responseData;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { quizText, loading, error, data };
};