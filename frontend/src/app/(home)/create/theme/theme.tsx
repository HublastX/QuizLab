"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hook/useTheme";

interface ThemeProps {
  onThemeChange: (data: { id?: string; title: string; description: string; isNew: boolean }) => void;
}

export function Theme({ onThemeChange }: ThemeProps) {
  const { themes, loading, getThemes } = useTheme();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("");

  useEffect(() => {
    getThemes();
  }, []);

  // Quando muda o tema selecionado
  useEffect(() => {
    if (selectedThemeId) {
      const selected = themes.find((t) => t.id === selectedThemeId);
      if (selected) {
        onThemeChange({
          id: selected.id,
          title: selected.title,
          description: selected.description,
          isNew: false,
        });
      }
    } else if (title) {
      onThemeChange({ title, description, isNew: true });
    }
  }, [selectedThemeId, title, description, themes]);

  // Quando seleciona um existente, limpa os campos
  const handleSelectChange = (id: string) => {
    setSelectedThemeId(id);
    if (id) {
      setTitle("");
      setDescription("");
    }
  };

  // Quando digita, limpa a seleção
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSelectedThemeId("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Tema</h1>
        <p>Qual é o tema do seu quiz?</p>
      </div>

      <div className="bg-layout-card p-6 rounded-2xl w-fit gap-4 flex flex-col">
        <div>
          <label htmlFor="theme">Tema</label>
          <Input
            id="theme"
            placeholder="Digite o tema do seu quiz"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Descrição</label>
          <Input
            id="description"
            placeholder="Digite a descrição do seu quiz"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p>Já tem um tema que deseja usar?</p>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <select
            name="themes"
            id="themes"
            value={selectedThemeId}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="mt-2 p-2 rounded border bg-layout-card"
          >
            <option value="">Selecione um tema</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}