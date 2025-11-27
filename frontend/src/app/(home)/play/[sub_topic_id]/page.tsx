"use client";
import { useQuestion } from "@/hook/useQuestion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Question } from "@/util/types/question";
import { Button } from "@/components/ui/button";

interface QuestionState {
    selectedAnswer: number | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
}

export default function SubTopicPlayPage() {
    const {
        getQuestionsBySubTopic,
        loading: hookLoading,
        error: hookError,
    } = useQuestion();
    const params = useParams();
    const router = useRouter();
    const subTopicId = Array.isArray(params?.sub_topic_id)
        ? params.sub_topic_id[0]
        : (params?.sub_topic_id as string);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const loadQuestions = async () => {
            if (subTopicId) {
                try {
                    setLoading(true);
                    const questionsData = await getQuestionsBySubTopic(
                        subTopicId
                    );
                    setQuestions(questionsData || []);
                    setQuestionStates(
                        (questionsData || []).map(() => ({
                            selectedAnswer: null,
                            isAnswered: false,
                            isCorrect: null,
                        }))
                    );
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

    const handleAnswerSelect = (answerIndex: number) => {
        const currentState = questionStates[currentQuestionIndex];
        if (currentState.isAnswered) return; // Não permite mudar resposta após confirmar

        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
            ...newStates[currentQuestionIndex],
            selectedAnswer: answerIndex,
        };
        setQuestionStates(newStates);
    };

    const handleConfirmAnswer = () => {
        const currentState = questionStates[currentQuestionIndex];
        if (currentState.selectedAnswer === null) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect =
            currentQuestion.alternatives[currentState.selectedAnswer].correct;

        const newStates = [...questionStates];
        newStates[currentQuestionIndex] = {
            ...newStates[currentQuestionIndex],
            isAnswered: true,
            isCorrect,
        };
        setQuestionStates(newStates);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
    };

    const handleRestartQuiz = () => {
        setQuestionStates(
            questions.map(() => ({
                selectedAnswer: null,
                isAnswered: false,
                isCorrect: null,
            }))
        );
        setCurrentQuestionIndex(0);
        setShowResults(false);
    };

    const calculateScore = () => {
        const correctAnswers = questionStates.filter(
            (state) => state.isCorrect === true
        ).length;
        return {
            correct: correctAnswers,
            total: questions.length,
            percentage: Math.round((correctAnswers / questions.length) * 100),
        };
    };

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

    // Tela de resultados
    if (showResults) {
        const score = calculateScore();
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-layout-card rounded-lg p-8 border">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        Quiz Concluído! 🎉
                    </h1>

                    <div className="mb-8 text-center">
                        <div className="inline-block bg-blue-100 rounded-full p-8 mb-4">
                            <div className="text-5xl font-bold text-blue-600">
                                {score.percentage}%
                            </div>
                        </div>
                        <p className="text-xl text-gray-700">
                            Você acertou {score.correct} de {score.total}{" "}
                            questões
                        </p>
                    </div>

                    {/* Resumo das questões */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Resumo das Respostas
                        </h2>
                        {questions.map((question, idx) => {
                            const state = questionStates[idx];
                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border-2 ${
                                        state.isCorrect
                                            ? "bg-green-50 border-green-300"
                                            : "bg-red-50 border-red-300"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                state.isCorrect
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {state.isCorrect ? "✓" : "✗"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium mb-1">
                                                Questão {idx + 1}:{" "}
                                                {question.text}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Sua resposta:{" "}
                                                {state.selectedAnswer !== null
                                                    ? question.alternatives[
                                                          state.selectedAnswer
                                                      ].text
                                                    : "Não respondida"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button onClick={handleRestartQuiz} >
                            Refazer Quiz
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="subtle"
                        >
                            Voltar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentState = questionStates[currentQuestionIndex];
    const correctAnswerIndex = currentQuestion.alternatives.findIndex(
        (alt) => alt.correct
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Cabeçalho com progresso */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">Quiz</h1>
                    <div className="text-sm text-gray-600">
                        {questionStates.filter((s) => s.isAnswered).length} de{" "}
                        {questions.length} respondidas
                    </div>
                </div>
                <p className="text-gray-600 mb-4">
                    Questão {currentQuestionIndex + 1} de {questions.length}
                </p>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${
                                ((currentQuestionIndex + 1) /
                                    questions.length) *
                                100
                            }%`,
                        }}
                    ></div>
                </div>
            </div>

            {/* Questão */}
            <div className="bg-layout-card rounded-lg p-6 mb-6 border">
                <h2 className="text-xl font-semibold mb-6">
                    {currentQuestion.text}
                </h2>

                {/* Alternativas */}
                <div className="space-y-3 mb-6">
                    {currentQuestion.alternatives.map((alternative, idx) => {
                        const isSelected = currentState.selectedAnswer === idx;
                        const isCorrectAnswer = idx === correctAnswerIndex;
                        const showCorrect =
                            currentState.isAnswered && isCorrectAnswer;
                        const showIncorrect =
                            currentState.isAnswered &&
                            isSelected &&
                            !isCorrectAnswer;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                disabled={currentState.isAnswered}
                                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                                    showCorrect
                                        ? "bg-green-50 border-green-500"
                                        : showIncorrect
                                        ? "bg-red-50 border-red-500"
                                        : isSelected
                                        ? "bg-blue-50 border-blue-500"
                                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                } ${
                                    currentState.isAnswered
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                            showCorrect
                                                ? "bg-green-500 border-green-500 text-white"
                                                : showIncorrect
                                                ? "bg-red-500 border-red-500 text-white"
                                                : isSelected
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "border-gray-400"
                                        }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {showCorrect
                                                ? "✓"
                                                : showIncorrect
                                                ? "✗"
                                                : String.fromCharCode(65 + idx)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {alternative.text}
                                        </p>
                                        {currentState.isAnswered &&
                                            (isCorrectAnswer || isSelected) && (
                                                <p className="text-sm mt-2 text-gray-700">
                                                    <span className="font-semibold">
                                                        Explicação:{" "}
                                                    </span>
                                                    {alternative.explanation}
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Botão de confirmar resposta */}
                {!currentState.isAnswered && (
                    <Button
                        onClick={handleConfirmAnswer}
                        disabled={currentState.selectedAnswer === null}
                        className="w-full"
                    >
                        Confirmar Resposta
                    </Button>
                )}
            </div>

            {/* Navegação */}
            <div className="flex justify-between items-center">
                <Button
                    variant="subtle"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    ← Anterior
                </Button>

                <div className="flex gap-2">
                    {questions.map((_, idx) => {
                        const state = questionStates[idx];
                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                    idx === currentQuestionIndex
                                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                                        : state.isAnswered
                                        ? state.isCorrect
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        : state.selectedAnswer !== null
                                        ? "bg-blue-300 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                {state.isAnswered ? (
                                    state.isCorrect ? (
                                        "✓"
                                    ) : (
                                        "✗"
                                    )
                                ) : (
                                    idx + 1
                                )}
                            </button>
                        );
                    })}
                </div>

                {currentState.isAnswered ? (
                    <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex === questions.length - 1
                            ? "Ver Resultados"
                            : "Próxima →"}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        disabled={!currentState.isAnswered}
                        variant="subtle"
                    >
                        Pular →
                    </Button>
                )}
            </div>
        </div>
    );
}
