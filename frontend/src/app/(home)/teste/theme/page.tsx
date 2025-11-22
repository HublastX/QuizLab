"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hook/useTheme";

export default function ThemesPageTest() {
  const { themes, loading, error, getThemes, createTheme } = useTheme();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getThemes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Título é obrigatório");
      return;
    }

    setCreating(true);
    try {
      await createTheme({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Erro ao criar theme:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading && themes.length === 0) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Temas</h1>

      {/* Formulário de criação */}
      <form onSubmit={handleCreate} className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-3">Criar novo tema</h2>
        
        <div className="mb-3">
          <label className="block mb-1">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do tema"
            className="w-full p-2 border rounded"
            disabled={creating}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do tema"
            className="w-full p-2 border rounded"
            rows={3}
            disabled={creating}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {creating ? "Criando..." : "Criar Theme"}
        </button>
      </form>

      {/* Lista de themes */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Seus temas ({themes.length})</h2>
        {themes.length > 0 ? (
          <div className="grid gap-3">
            {themes.map((theme) => (
              <div key={theme.id} className="p-4 border rounded">
                <h3 className="font-semibold">{theme.title}</h3>
                <p className="text-gray-600">{theme.description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Criado em: {new Date(theme.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum tema encontrado. Crie o primeiro!</p>
        )}
      </div>
    </div>
  );
}