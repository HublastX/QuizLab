"use client";

import { useTheme } from "@/app/hook/useTheme";
import HomeCard from "./card";
import { useEffect, useState } from "react";

export default function ThemeList() {
    const { getThemes, loading, error } = useTheme();
    const [themes, setThemes] = useState<any[]>([]);

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const themesData = await getThemes();
                setThemes(themesData);
            } catch (err) {
                console.error("Erro ao carregar temas:", err);
            }
        };

        fetchThemes();
    }, [getThemes]);

    if (loading) {
        return <div>Carregando temas...</div>;
    }

    if (error) {
        return <div>Erro ao carregar temas: {error}</div>;
    }

    return (
        <div>
            <h1>Lista de Temas</h1>
            <div>
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
                    <p>Nenhum tema encontrado</p>
                )}
            </div>
        </div>
    );
}
