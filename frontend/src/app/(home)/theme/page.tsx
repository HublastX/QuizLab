"use client";

import { useTheme } from "@/hook/useTheme";
import { useState } from "react";

export default function ThemePageTest() {
  const { theme, loading, error } = useTheme();
  const [themeData, setThemeData] = useState({
    title: "",
    description: ""
  });
  const [createdTheme, setCreatedTheme] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!themeData.title.trim() || !themeData.description.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const result = await theme(themeData);
      setCreatedTheme(result);
      setThemeData({ title: "", description: "" });
    } catch (err) {
      console.error("Erro ao criar tema:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThemeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div >
      <h1 >Criar Novo Tema</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            id="title"
            name="title"
            value={themeData.title}
            onChange={handleChange}
            placeholder="Digite o título do tema"
            disabled={loading}
          />

          <textarea
            id="description"
            name="description"
            value={themeData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Digite a descrição do tema"
            disabled={loading}
          />

        <button
          type="submit"
          disabled={loading}        >
          {loading ? "Criando..." : "Criar Tema"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          Erro: {error}
        </div>
      )}

      {createdTheme && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Tema criado com sucesso!</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>ID:</strong> {createdTheme.id}</p>
            <p><strong>Título:</strong> {createdTheme.title}</p>
            <p><strong>Descrição:</strong> {createdTheme.description}</p>
            <p><strong>User ID:</strong> {createdTheme.user_id}</p>
            <p><strong>Criado em:</strong> {new Date(createdTheme.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}