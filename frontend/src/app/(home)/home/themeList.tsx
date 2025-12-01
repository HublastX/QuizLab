"use client";

import { useEffect } from "react";
import { useTheme } from "@/hook/useTheme";
import HomeCard from "./card";

export default function ThemeList() {
    const { themes, loading, error, getThemes } = useTheme();

    useEffect(() => {
        getThemes();
    }, []);

    if (loading) {
        return <p>Carregando temas...</p>;
    }

    if (error) {
        return <p>Erro ao carregar temas: {error}</p>;
    }

    return (
        <div className="flex flex-col justify-center gap-4 md:gap-6 h-full border p-4 md:p-6 rounded-lg bg-layout-card">
            <h1 className="text-xl sm:text-2xl font-bold">Lista de Temas</h1>
            <div className="w-full flex flex-col gap-3 overflow-y-auto h-full">
                {themes.length > 0 ? (
                    themes.map((theme) => (
                        <HomeCard
                            key={theme.id}
                            title={theme.title}
                            description={theme.description}
                            href={theme.id}
                            color="play"
                            variant="theme"
                        />
                    ))
                ) : (
                    <p className="text-sm sm:text-base">
                        Nenhum tema encontrado
                    </p>
                )}
            </div>
        </div>
    );
}
