"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hook/useTheme";
import { useSubTopic } from "@/hook/useSubTopic";
import { Theme } from "@/util/types/theme";
import { SubTopic } from "@/util/types/subTopic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import LoadingScreen from "@/layout/LoadingScreen";

export default function PlayPage() {
    const { getThemes, updateTheme, deleteTheme } = useTheme();
    const { getSubTopicsByTheme, updateSubTopic, deleteSubTopic } = useSubTopic();

    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubTopics, setLoadingSubTopics] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Edit states
    const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
    const [editingSubTopic, setEditingSubTopic] = useState<SubTopic | null>(null);
    const [deleteConfirmTheme, setDeleteConfirmTheme] = useState<string | null>(null);
    const [deleteConfirmSubTopic, setDeleteConfirmSubTopic] = useState<string | null>(null);

    useEffect(() => {
        loadThemes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadThemes = async () => {
        try {
            setLoading(true);
            const data = await getThemes();
            setThemes(data || []);
            setError(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Erro ao carregar temas";
            setError(errorMessage);
            console.error("Error loading themes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTheme = async (theme: Theme) => {
        setSelectedTheme(theme);
        setLoadingSubTopics(true);
        try {
            const data = await getSubTopicsByTheme(theme.id);
            setSubTopics(data || []);
            setError(null);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Erro ao carregar subtópicos";
            setError(errorMessage);
            console.error("Error loading subtopics:", err);
        } finally {
            setLoadingSubTopics(false);
        }
    };

    const handleClosePanel = () => {
        setSelectedTheme(null);
        setSubTopics([]);
        setEditingSubTopic(null);
        setDeleteConfirmSubTopic(null);
    };

    const handleSaveTheme = async () => {
        if (!editingTheme) return;

        try {
            await updateTheme(editingTheme.id, {
                title: editingTheme.title,
                description: editingTheme.description,
            });
            await loadThemes();
            setEditingTheme(null);
        } catch (err) {
            console.error("Error updating theme:", err);
            alert("Erro ao atualizar tema");
        }
    };

    const handleDeleteTheme = async (themeId: string) => {
        try {
            await deleteTheme(themeId);
            await loadThemes();
            setDeleteConfirmTheme(null);
            if (selectedTheme?.id === themeId) {
                handleClosePanel();
            }
        } catch (err) {
            console.error("Error deleting theme:", err);
            alert("Erro ao deletar tema");
        }
    };

    const handleSaveSubTopic = async () => {
        if (!editingSubTopic) return;

        try {
            await updateSubTopic(editingSubTopic.id, {
                sub_topic: editingSubTopic.sub_topic,
                description: editingSubTopic.description,
            });
            if (selectedTheme) {
                const data = await getSubTopicsByTheme(selectedTheme.id);
                setSubTopics(data || []);
            }
            setEditingSubTopic(null);
        } catch (err) {
            console.error("Error updating subtopic:", err);
            alert("Erro ao atualizar subtópico");
        }
    };

    const handleDeleteSubTopic = async (subTopicId: string) => {
        try {
            await deleteSubTopic(subTopicId);
            if (selectedTheme) {
                const data = await getSubTopicsByTheme(selectedTheme.id);
                setSubTopics(data || []);
            }
            setDeleteConfirmSubTopic(null);
        } catch (err) {
            console.error("Error deleting subtopic:", err);
            alert("Erro ao deletar subtópico");
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen">
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold">
                        Jogar Quiz
                    </h1>
                    <p className="mt-2">
                        Selecione um tema para começar a jogar
                    </p>
                </div>

                {error && !selectedTheme ? (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                        <p className="text-destructive">Erro: {error}</p>
                        <Button
                            onClick={() => window.location.reload()} 
                            variant="subtle" 
                            className="mt-2"
                        >
                            Tentar Novamente
                        </Button>
                    </div>
                ) : null}

                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* Lista de Temas */}
                    <div className="flex-1">
                        {themes.length === 0 ? (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <p >
                                    Nenhum tema disponível no momento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {themes.map((theme) => (
                                    <div key={theme.id} className="relative">
                                        {editingTheme?.id === theme.id ? (
                                            // Edit Mode
                                            <div className="bg-layout-card border rounded-xl p-6 space-y-3">
                                                <Input
                                                    value={editingTheme.title}
                                                    onChange={(e) => setEditingTheme({ ...editingTheme, title: e.target.value })}
                                                    placeholder="Título"
                                                    className="font-bold"
                                                />
                                                <textarea
                                                    value={editingTheme.description}
                                                    onChange={(e) => setEditingTheme({ ...editingTheme, description: e.target.value })}
                                                    placeholder="Descrição"
                                                    className="w-full p-2 border rounded-lg bg-background text-sm min-h-[60px]"
                                                />
                                                <div className="flex gap-2">
                                                    <Button onClick={() => setEditingTheme(null)} variant="subtle" size="sm" className="flex-1">
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={handleSaveTheme} size="sm" className="flex-1">
                                                        Salvar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <>
                                                <button
                                                    onClick={() => handleSelectTheme(theme)}
                                                    className={`w-full p-6 rounded-xl border transition-all duration-200 hover:border-2 text-left hover:shadow-md hover:scale-[1.02] group ${
                                                        selectedTheme?.id === theme.id
                                                            ? "border-primary border-3 bg-primary/5 shadow-md "
                                                            : "border bg-card hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div className="flex flex-col h-full">
                                                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                                                            {theme.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                                                            {theme.description}
                                                        </p>
                                                        <div className="mt-4 flex justify-between items-center">
                                                            <span className="text-xs text-primary font-medium">
                                                                Ver subtópicos
                                                            </span>
                                                            <div className={`w-2 h-2 rounded-full transition-colors ${
                                                                selectedTheme?.id === theme.id 
                                                                    ? "bg-primary" 
                                                                    : "bg-muted group-hover:bg-primary/50"
                                                            }`} />
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                {/* Edit/Delete Buttons */}
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingTheme({ ...theme });
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-surface-strong transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirmTheme(theme.id);
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-surface-strong transition-colors text-destructive"
                                                        title="Deletar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Delete Confirmation */}
                                                {deleteConfirmTheme === theme.id && (
                                                    <div className="absolute inset-0 bg-layout-card border border-destructive rounded-xl p-4 flex flex-col justify-center items-center gap-3 z-10">
                                                        <p className="text-sm font-semibold text-center">
                                                            Deletar tema?
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeleteConfirmTheme(null);
                                                                }}
                                                                variant="subtle"
                                                                size="sm"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteTheme(theme.id);
                                                                }}
                                                                size="sm"
                                                                className="bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Deletar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Painel Lateral de Subtópicos */}
                    {selectedTheme && (
                        <div className="lg:w-96 w-full bg-layout-card border rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-200px)] lg:max-h-[80vh]">
                            {/* Header do Painel */}
                            <div className="p-6 border-b flex items-start justify-between bg-muted/10 rounded-t-xl">
                                <div className="flex-1 pr-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                        <h2 className="text-xl font-bold text-foreground">
                                            {selectedTheme.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTheme.description}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClosePanel}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                                    aria-label="Fechar painel"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Lista de Subtópicos */}
                            <div className="flex-1 overflow-auto p-6">
                                {loadingSubTopics ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                                        <p className="text-sm text-muted-foreground">
                                            Carregando subtópicos...
                                        </p>
                                    </div>
                                ) : subTopics.length === 0 ? (
                                    <div className="text-center py-8 border border-dashed rounded-lg">
                                        <p className="text-muted-foreground text-sm">
                                            Nenhum subtópico disponível para este tema.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-foreground">
                                                Subtópicos ({subTopics.length})
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                Selecione uma opção
                                            </span>
                                        </div>
                                        {subTopics.map((subTopic) => (
                                            <div key={subTopic.id}>
                                                {editingSubTopic?.id === subTopic.id ? (
                                                    // Edit Mode
                                                    <div className="bg-layout-card border rounded-lg p-4 space-y-3">
                                                        <Input
                                                            value={editingSubTopic.sub_topic}
                                                            onChange={(e) => setEditingSubTopic({ ...editingSubTopic, sub_topic: e.target.value })}
                                                            placeholder="Nome do subtópico"
                                                            className="font-semibold"
                                                        />
                                                        <textarea
                                                            value={editingSubTopic.description}
                                                            onChange={(e) => setEditingSubTopic({ ...editingSubTopic, description: e.target.value })}
                                                            placeholder="Descrição"
                                                            className="w-full p-2 border rounded-lg bg-background text-xs min-h-[50px]"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button onClick={() => setEditingSubTopic(null)} variant="subtle" size="sm" className="flex-1">
                                                                Cancelar
                                                            </Button>
                                                            <Button onClick={handleSaveSubTopic} size="sm" className="flex-1">
                                                                Salvar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : deleteConfirmSubTopic === subTopic.id ? (
                                                    // Delete Confirmation
                                                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-3">
                                                        <p className="text-sm font-semibold text-center">
                                                            Deletar subtópico?
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => setDeleteConfirmSubTopic(null)}
                                                                variant="subtle"
                                                                size="sm"
                                                                className="flex-1"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDeleteSubTopic(subTopic.id)}
                                                                size="sm"
                                                                className="flex-1 bg-destructive hover:bg-destructive/90"
                                                            >
                                                                Deletar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // View Mode
                                                    <div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all bg-background/50">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className="font-semibold text-foreground flex-1">
                                                                {subTopic.sub_topic}
                                                            </h4>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => setEditingSubTopic({ ...subTopic })}
                                                                    className="p-1 hover:bg-surface rounded transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirmSubTopic(subTopic.id)}
                                                                    className="p-1 hover:bg-surface rounded transition-colors text-destructive"
                                                                    title="Deletar"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                                            {subTopic.description}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/play/${subTopic.id}`}
                                                                className="flex-1"
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full text-xs"
                                                                >
                                                                    Jogar
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={`/play/${subTopic.id}/questions`}
                                                                className="flex-1"
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="subtle"
                                                                    className="w-full text-xs"
                                                                >
                                                                    Questões
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}