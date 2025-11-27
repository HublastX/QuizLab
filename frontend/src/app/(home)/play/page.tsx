"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hook/useTheme";
import { useSubTopic } from "@/hook/useSubTopic";
import { Theme } from "@/util/types/theme";
import { SubTopic } from "@/util/types/subTopic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoadingScreen from "@/layout/LoadingScreen";

export default function PlayPage() {
    const { getThemes } = useTheme();
    const { getSubTopicsByTheme } = useSubTopic();

    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubTopics, setLoadingSubTopics] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carrega os temas quando a página abre
    useEffect(() => {
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

        loadThemes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Carrega os subtópicos quando um tema é selecionado
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
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                        Jogar Quiz
                    </h1>
                    <p className="mt-2 text-muted-foreground">
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

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Lista de Temas - Conteúdo Principal */}
                    <div className="flex-1">
                        {themes.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">
                                    Nenhum tema disponível no momento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleSelectTheme(theme)}
                                        className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md hover:scale-[1.02] group ${
                                            selectedTheme?.id === theme.id
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-border bg-card hover:border-primary/50"
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
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Painel Lateral de Subtópicos */}
                    {selectedTheme && (
                        <div className="lg:w-96 w-full bg-card border rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-200px)] lg:max-h-[80vh] lg:absolute lg:right-6 lg:top-24">
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
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
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
                                            <div
                                                key={subTopic.id}
                                                className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all bg-background/50"
                                            >
                                                <h4 className="font-semibold text-foreground mb-2">
                                                    {subTopic.sub_topic}
                                                </h4>
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
                                                        href={`/teste/question?subTopic=${subTopic.id}`}
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