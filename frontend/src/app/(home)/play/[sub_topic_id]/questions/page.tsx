"use client";

import { useQuestion } from "@/hook/useQuestion";
import { useAlternative } from "@/hook/useAlternative";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Question } from "@/util/types/question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuestionsPage() {
    const { getQuestionsBySubTopic, updateQuestion, deleteQuestion, loading: hookLoading } = useQuestion();
    const { updateAlternative, deleteAlternative } = useAlternative();
    const params = useParams();
    const router = useRouter();
    const subTopicId = Array.isArray(params?.sub_topic_id)
        ? params.sub_topic_id[0]
        : (params?.sub_topic_id as string);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subTopicId]);

    const loadQuestions = async () => {
        if (subTopicId) {
            try {
                setLoading(true);
                const questionsData = await getQuestionsBySubTopic(subTopicId);
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

    const handleEdit = (question: Question) => {
        setEditingQuestion({ ...question });
    };

    const handleCancelEdit = () => {
        setEditingQuestion(null);
    };

    const handleSaveEdit = async () => {
        if (!editingQuestion) return;

        try {
            // Atualizar apenas o texto da questão
            await updateQuestion(editingQuestion.id, {
                text: editingQuestion.text,
            });

            // Atualizar cada alternativa individualmente
            for (const alt of editingQuestion.alternatives) {
                await updateAlternative(alt.id, {
                    text: alt.text,
                    explanation: alt.explanation,
                    correct: alt.correct,
                });
            }

            await loadQuestions();
            setEditingQuestion(null);
        } catch (err) {
            console.error("Error updating question:", err);
            alert("Erro ao atualizar questão");
        }
    };

    const handleDelete = async (questionId: string) => {
        try {
            await deleteQuestion(questionId);
            await loadQuestions();
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Error deleting question:", err);
            alert("Erro ao deletar questão");
        }
    };

    const updateEditingQuestionText = (text: string) => {
        if (editingQuestion) {
            setEditingQuestion({ ...editingQuestion, text });
        }
    };

    const updateEditingAlternative = (index: number, field: 'text' | 'explanation', value: string) => {
        if (editingQuestion) {
            const newAlternatives = [...editingQuestion.alternatives];
            newAlternatives[index] = { ...newAlternatives[index], [field]: value };
            setEditingQuestion({ ...editingQuestion, alternatives: newAlternatives });
        }
    };

    const toggleCorrectAlternative = (index: number) => {
        if (editingQuestion) {
            const newAlternatives = editingQuestion.alternatives.map((alt, i) => ({
                ...alt,
                correct: i === index,
            }));
            setEditingQuestion({ ...editingQuestion, alternatives: newAlternatives });
        }
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

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-layout-card border rounded-lg p-4">
                    <p className="text-destructive">Erro: {error}</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-6">
                    <Button onClick={() => router.back()} variant="subtle">
                        ← Voltar
                    </Button>
                </div>
                <div className="bg-layout-card border rounded-lg p-8 text-center">
                    <p>Nenhuma questão encontrada para este subtópico.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gerenciar Questões</h1>
                    <p className="text-muted-foreground">
                        {questions.length} {questions.length === 1 ? 'questão encontrada' : 'questões encontradas'}
                    </p>
                </div>
                <Button onClick={() => router.back()} variant="subtle">
                    ← Voltar
                </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((question, idx) => (
                    <div key={question.id} className="bg-layout-card border rounded-lg p-6">
                        {editingQuestion?.id === question.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-2">
                                        Questão {idx + 1}
                                    </label>
                                    <Input
                                        value={editingQuestion.text}
                                        onChange={(e) => updateEditingQuestionText(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block font-semibold">Alternativas</label>
                                    {editingQuestion.alternatives.map((alt, altIdx) => (
                                        <div key={alt.id} className="bg-layout-card border rounded-lg p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={alt.correct}
                                                    onChange={() => toggleCorrectAlternative(altIdx)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="font-medium">
                                                    Alternativa {String.fromCharCode(65 + altIdx)}
                                                    {alt.correct && " (Correta)"}
                                                </span>
                                            </div>
                                            <Input
                                                value={alt.text}
                                                onChange={(e) => updateEditingAlternative(altIdx, 'text', e.target.value)}
                                                placeholder="Texto da alternativa"
                                                className="w-full"
                                            />
                                            <Input
                                                value={alt.explanation}
                                                onChange={(e) => updateEditingAlternative(altIdx, 'explanation', e.target.value)}
                                                placeholder="Explicação"
                                                className="w-full"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button onClick={handleCancelEdit} variant="subtle">
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleSaveEdit}>
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Questão {idx + 1}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(question)}
                                            className="p-2 hover:bg-surface rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(question.id)}
                                            className="p-2 hover:bg-surface rounded-lg transition-colors text-destructive"
                                            title="Deletar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <p className="mb-4">{question.text}</p>

                                <div className="space-y-2">
                                    {question.alternatives.map((alt, altIdx) => (
                                        <div
                                            key={alt.id}
                                            className={`p-3 rounded-lg border ${
                                                alt.correct
                                                    ? "bg-badge-success/10 border-badge-success/30"
                                                    : "bg-layout-card border"
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="font-semibold">
                                                    {String.fromCharCode(65 + altIdx)}.
                                                </span>
                                                <div className="flex-1">
                                                    <p>{alt.text}</p>
                                                    {alt.explanation && (
                                                        <p className="text-sm mt-1 opacity-75">
                                                            <span className="font-semibold">Explicação:</span> {alt.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                                {alt.correct && (
                                                    <span className="text-badge-success font-semibold text-sm">
                                                        ✓ Correta
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation */}
                        {deleteConfirm === question.id && (
                            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                                <p className="font-semibold mb-3">
                                    Tem certeza que deseja deletar esta questão?
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setDeleteConfirm(null)}
                                        variant="subtle"
                                        size="sm"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(question.id)}
                                        size="sm"
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Confirmar Exclusão
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}