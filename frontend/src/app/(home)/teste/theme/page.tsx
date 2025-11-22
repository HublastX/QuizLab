"use client";

import { useEffect } from "react";
import { useTheme } from "@/hook/useTheme";

export default function ThemesPageTest() {
  const { themes, loading, error, getThemes, createTheme } = useTheme();

  useEffect(() => {
    getThemes();
  }, []);

  const handleCreate = async () => {
    await createTheme({
      title: "Meu Theme",
      description: "Descrição do theme"
    });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <button onClick={handleCreate}>Criar Theme</button>
      {themes.map((theme) => (
        <div key={theme.id}>{theme.title}</div>
      ))}
    </div>
  );
}