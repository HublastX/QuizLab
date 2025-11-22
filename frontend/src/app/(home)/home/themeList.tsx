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