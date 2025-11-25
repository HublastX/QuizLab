"use client";
import { useQuestion } from "@/hook/useQuestion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Question } from "@/util/types/question";
import { Button } from "@/components/ui/button";

export default function SubTopicPlayPage() {
    const {
        getQuestionsBySubTopic,
        loading: hookLoading,
        error: hookError,
    } = useQuestion();
    const params = useParams();
    const subTopicId = Array.isArray(params?.sub_topic_id)
        ? params.sub_topic_id[0]
        : (params?.sub_topic_id as string);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const loadQuestions = async () => {
            if (subTopicId) {
                try {
                    setLoading(true);
                    const questionsData = await getQuestionsBySubTopic(
                        subTopicId
                    );
                    setQuestions(questionsData || []);
                    setError(null);
                } catch (err) {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : "Erro ao carregar questões";
                    setError(errorMessage);
                    console.error("Error loading questions:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subTopicId]);

    if (loading || hookLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Carregando questões...</p>
                </div>
            </div>
        );
    }

    if (error || hookError) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Erro: {error || hookError}</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Nenhuma questão encontrada para este subtópico.
                    </p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Quiz</h1>
                <p className="text-gray-600">
                    Questão {currentQuestionIndex + 1} de {questions.length}
                </p>
            </div>

            {/* Questão */}
            <div className="bg-layout-card rounded-lg p-6 mb-6 border">
                <h2 className="text-xl font-semibold mb-4">
                    {currentQuestion.text}
                </h2>

                {/* Alternativas */}
                <div className="space-y-3">
                    {currentQuestion.alternatives.map((alternative, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mt-0.5">
                                    <span className="text-sm">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {alternative.text}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navegação */}
            <div className="flex justify-between items-center">
                <Button
                    variant="subtle"
                    onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                >
                    ← Anterior
                </Button>

                <div className="flex gap-2">
                    {questions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                idx === currentQuestionIndex
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                            Math.min(questions.length - 1, prev + 1)
                        )
                    }
                    disabled={currentQuestionIndex === questions.length - 1}
                >
                    Próxima →
                </Button>
            </div>
        </div>
    );
}
