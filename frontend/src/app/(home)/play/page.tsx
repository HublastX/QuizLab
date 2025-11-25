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
        return (
            <LoadingScreen  />
        );
    }

    if (error && !selectedTheme) {
        return (
            <div className="p-6">
                <div >
                    <p >Erro: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-full">
            {/* Lista de Temas */}
            <div className="flex-1 overflow-hidden">
                <div className="p-6 h-full overflow-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Jogar Quiz</h1>
                        <p className="mt-3">
                            Selecione um tema para começar
                        </p>
                    </div>

                    {themes.length === 0 ? (
                        <div >
                            <p >
                                Nenhum tema disponível.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    aria-label={theme.title + " - " + theme.description}
                                    onClick={() => handleSelectTheme(theme)}
                                    className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                                        selectedTheme?.id === theme.id
                                            ? "bg-layout-card"
                                            : "border-category-play bg-layout-card hover:border-qblue-default"
                                    }`}
                                >
                                    <h3 className="font-bold text-lg mb-2">
                                        {theme.title}
                                    </h3>
                                    <p className="text-sm line-clamp-3">
                                        {theme.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Painel Lateral de Subtópicos */}
            {selectedTheme && (
                <div className="w-96 bg-layout-card border-l border flex flex-col shadow-lg rounded-2xl absolute right-4">
                    {/* Header do Painel */}
                    <div className="p-6 border-b flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold">
                                {selectedTheme.title}
                            </h2>
                            <p className="text-sm mt-1">
                                {selectedTheme.description}
                            </p>
                        </div>
                        <button
                            onClick={handleClosePanel}
                            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Lista de Subtópicos */}
                    <div className="flex-1 overflow-auto p-6">
                        {loadingSubTopics ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                                    <p className="text-sm">
                                        Carregando subtópicos...
                                    </p>
                                </div>
                            </div>
                        ) : subTopics.length === 0 ? (
                            <div className="border rounded-lg p-4">
                                <p className="text-sm ">
                                    Nenhum subtópico disponível para este tema.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {subTopics.map((subTopic) => (
                                    <div
                                        key={subTopic.id}
                                        className="border rounded-lg p-4 hover:border-qblue-default transition-colors"
                                    >
                                        <h3 className="font-semibold mb-2">
                                            {subTopic.sub_topic}
                                        </h3>
                                        <p className="text-xs mb-4 line-clamp-2">
                                            {subTopic.description}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/quiz-lab/play/${subTopic.id}`}
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
                                                href={`/quiz-lab/teste/question?subTopic=${subTopic.id}`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="subtle"
                                                    className="w-full text-xs"
                                                >
                                                    Ver Questões
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
    );
}
