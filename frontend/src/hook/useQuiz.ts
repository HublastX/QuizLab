"use client";

import { useState } from "react";
import { getApiUrl } from "@/lib/api";

interface QuizParams {
    text?: string;
    themeid?: string;
    subtopicid?: string;
    num_quest?: string;
    num_alt?: string;
}

export const useQuiz = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const quizText = async (params: QuizParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(getApiUrl('/quiz/text'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(params),
            });
            
            if (!response.ok) {
                throw new Error("Falha ao gerar quiz");
            }
            
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    return { quizText, loading, error };
};