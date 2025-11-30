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
    const [focusedAlternativeIndex, setFocusedAlternativeIndex] = useState<number>(0);

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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showResults) return;

            const currentState = questionStates[currentQuestionIndex];
            const currentQuestion = questions[currentQuestionIndex];

            // Navigate between alternatives with Up/Down arrows
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (!currentState?.isAnswered && currentQuestion) {
                    setFocusedAlternativeIndex((prev) => 
                        Math.min(prev + 1, currentQuestion.alternatives.length - 1)
                    );
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (!currentState?.isAnswered && currentQuestion) {
                    setFocusedAlternativeIndex((prev) => Math.max(prev - 1, 0));
                }
            }
            // Navigate between questions with Left/Right arrows
            else if (e.key === "ArrowLeft") {
                e.preventDefault();
                if (currentQuestionIndex > 0) {
                    handlePreviousQuestion();
                }
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                if (currentState?.isAnswered) {
                    handleNextQuestion();
                }
            }
            // Confirm answer with Enter
            else if (e.key === "Enter") {
                e.preventDefault();
                if (!currentState?.isAnswered) {
                    if (currentState?.selectedAnswer === null) {
                        // Select the focused alternative
                        handleAnswerSelect(focusedAlternativeIndex);
                    }
                    // Confirm the answer
                    handleConfirmAnswer();
                } else {
                    // Move to next question if already answered
                    handleNextQuestion();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentQuestionIndex, questionStates, questions, showResults, focusedAlternativeIndex]);

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
            setFocusedAlternativeIndex(0);
        } else {
            setShowResults(true);
        }
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
        setFocusedAlternativeIndex(0);
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
        
        const getFeedbackMessage = (percentage: number) => {
            if (percentage === 100) return { title: "Perfeito!", message: "Você dominou este assunto!" };
            if (percentage >= 80) return { title: "Excelente!", message: "Você tem um ótimo conhecimento!" };
            if (percentage >= 60) return { title: "Muito Bom!", message: "Você está no caminho certo!" };
            if (percentage >= 40) return { title: "Bom esforço!", message: "Continue estudando para melhorar." };
            return { title: "Continue Tentando!", message: "Não desista, a prática leva à perfeição." };
        };

        const feedback = getFeedbackMessage(score.percentage);

        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-layout-card rounded-2xl p-8 border shadow-sm">
                    {/* Hero Section */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-2 text-foreground">
                            {feedback.title}
                        </h1>
                        <p className=" text-lg mb-8">
                            {feedback.message}
                        </p>

                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle
                                    className="text-gray-200"
                                    strokeWidth="12"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="88"
                                    cx="96"
                                    cy="96"
                                />
                                <circle
                                    className={`${
                                        score.percentage >= 70 ? "text-badge-success" : 
                                        score.percentage >= 40 ? "text-qyellow-500" : "text-badge-error"
                                    } transition-all duration-1000 ease-out`}
                                    strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - score.percentage / 100)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="88"
                                    cx="96"
                                    cy="96"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-5xl font-bold text-foreground">
                                    {score.percentage}%
                                </span>
                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">
                                    Acerto
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="bg-badge-success/10 border border-badge-success/20 rounded-xl p-4 text-center">
                            <div className="text-badge-success font-bold text-2xl mb-1">{score.correct}</div>
                            <div className="text-badge-success font-medium text-sm">Acertos</div>
                        </div>
                        <div className="bg-badge-error/10 border border-badge-error/20 rounded-xl p-4 text-center">
                            <div className="text-badge-error font-bold text-2xl mb-1">{score.total - score.correct}</div>
                            <div className="text-badge-error font-medium text-sm">Erros</div>
                        </div>
                        <div className="bg-qblue-default/10 border border-qblue-default/20 rounded-xl p-4 text-center">
                            <div className="text-qblue-default font-bold text-2xl mb-1">{score.total}</div>
                            <div className="text-qblue-default font-medium text-sm">Total</div>
                        </div>
                    </div>

                    {/* Resumo das questões */}
                    <div className="space-y-6 mb-10">
                        <h2 className="text-xl font-bold text-foreground border-b pb-2 mb-4">
                            Revisão Detalhada
                        </h2>
                        {questions.map((question, idx) => {
                            const state = questionStates[idx];
                            const isCorrect = state.isCorrect;
                            
                            return (
                                <div
                                    key={idx}
                                    className="bg-layout-card rounded-xl border p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                                                isCorrect
                                                    ? "bg-badge-success"
                                                    : "bg-badge-error"
                                            }`}
                                        >
                                            {isCorrect ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-foreground text-lg">
                                                    Questão {idx + 1}
                                                </h3>
                                            </div>
                                            
                                            <p className="text-foreground mb-4 text-base leading-relaxed">
                                                {question.text}
                                            </p>
                                            
                                            <div className="space-y-2">
                                                {/* Resposta do usuário */}
                                                <div className={`p-3 rounded-lg border-2 ${
                                                    isCorrect 
                                                        ? "bg-badge-success/40 border-badge-success" 
                                                        : "bg-badge-error/40 border-badge-error"
                                                }`}>
                                                    <p className="text-sm font-medium mb-1">Sua resposta:</p>
                                                    <p className="text-foreground">
                                                        {state.selectedAnswer !== null
                                                            ? question.alternatives[state.selectedAnswer].text
                                                            : "Não respondida"}
                                                    </p>
                                                </div>

                                                {/* Resposta correta (se errou) */}
                                                {!isCorrect && (
                                                    <div className="p-3 rounded-lg border-2 bg-badge-success/40 border-badge-success">
                                                        <p className="text-sm font-medium mb-1">Resposta correta:</p>
                                                        <p className="text-foreground">
                                                            {question.alternatives.find(a => a.correct)?.text}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 justify-center pt-4 border-t">
                        <Button onClick={handleRestartQuiz} className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                            Refazer Quiz
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="subtle"
                            className="px-8 py-6 text-lg"
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
                    <div className="text-sm ">
                        {questionStates.filter((s) => s.isAnswered).length} de{" "}
                        {questions.length} respondidas
                    </div>
                </div>
                <p className=" mb-4">
                    Questão {currentQuestionIndex + 1} de {questions.length}
                </p>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-qblue-600 to-qblue-default h-2 rounded-full transition-all duration-300"
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

                        const isFocused = !currentState.isAnswered && focusedAlternativeIndex === idx;
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                disabled={currentState.isAnswered}
                                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                                    showCorrect
                                        ? "bg-badge-success/40 border-badge-success"
                                        : showIncorrect
                                        ? "bg-badge-error/40 border-badge-error"
                                        : isSelected
                                        ? "bg-qblue-default/40 border-qblue-default"
                                        : isFocused
                                        ? "bg-qorange-default/20 border-qorange-default ring-2 ring-qorange-default"
                                        : "border-gray-300 hover:bg-qblue-default/40 hover:border-qblue-default"
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
                                                ? "bg-badge-success/40 border-badge-success "
                                                : showIncorrect
                                                ? "bg-badge-error/40 border-badge-error "
                                                : isSelected
                                                ? "bg-qblue-default/40 border-qblue-default "
                                                : isFocused
                                                ? "bg-qorange-default/40 border-qorange-default"
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
                                                <p className="text-sm mt-2 ">
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
            <div className="flex justify-between items-center gap-3">
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
                                        ? "bg-qblue-default/60 ring-2 ring-qblue-default"
                                        : state.isAnswered
                                        ? state.isCorrect
                                            ? "bg-badge-success text-white"
                                            : "bg-badge-error text-white"
                                        : state.selectedAnswer !== null
                                        ? "bg-qblue-default/60 text-white"
                                        : "bg-qorange-default/40 hover:bg-qorange-default"
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

                <Button 
                    onClick={handleNextQuestion}
                    disabled={!currentState.isAnswered}
                >
                    {currentQuestionIndex === questions.length - 1
                        ? "Ver Resultados"
                        : "Próxima →"}
                </Button>
            </div>
        </div>
    );
}
