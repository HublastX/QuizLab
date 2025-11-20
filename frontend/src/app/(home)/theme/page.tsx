"use client";

import { useTheme } from "@/hook/useTheme";
import { useState, useEffect } from "react";

export default function ThemePageTest() {
  const { postTheme, getThemes, getThemeById, loading, error } = useTheme();
  const [themeData, setThemeData] = useState({
    title: "",
    description: ""
  });
  const [themeId, setThemeId] = useState("");
  const [createdTheme, setCreatedTheme] = useState<any>(null);
  const [allThemes, setAllThemes] = useState<any[]>([]);
  const [specificTheme, setSpecificTheme] = useState<any>(null);

  // Criar novo tema
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!themeData.title.trim() || !themeData.description.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const result = await postTheme(themeData);
      setCreatedTheme(result);
      setThemeData({ title: "", description: "" });
      // Atualiza a lista de temas após criar um novo
      fetchAllThemes();
    } catch (err) {
      console.error("Erro ao criar tema:", err);
    }
  };

  // Buscar todos os temas
  const fetchAllThemes = async () => {
    try {
      const themes = await getThemes();
      setAllThemes(themes);
    } catch (err) {
      console.error("Erro ao buscar temas:", err);
    }
  };

  // Buscar tema específico por ID
  const fetchThemeById = async () => {
    if (!themeId.trim()) {
      alert("Digite um ID de tema");
      return;
    }

    try {
      const theme = await getThemeById(themeId);
      setSpecificTheme(theme);
    } catch (err) {
      console.error("Erro ao buscar tema:", err);
      setSpecificTheme(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setThemeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeId(e.target.value);
  };

  // Carrega todos os temas ao inicializar o componente
  useEffect(() => {
    fetchAllThemes();
  }, []);

  return (
    <div>
      <h1>Gerenciamento de Temas</h1>
      
      {/* Seção: Criar Novo Tema */}
      <section>
        <h2>Criar Novo Tema</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="title"
              name="title"
              value={themeData.title}
              onChange={handleChange}
              placeholder="Digite o título do tema"
              disabled={loading}
            />
          </div>

          <div>
            <textarea
              id="description"
              name="description"
              value={themeData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Digite a descrição do tema"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Tema"}
          </button>
        </form>
      </section>

      {/* Seção: Buscar Tema por ID */}
      <section>
        <h2>Buscar Tema por ID</h2>
        
        <div>
          <input
            type="text"
            value={themeId}
            onChange={handleThemeIdChange}
            placeholder="Digite o ID do tema"
            disabled={loading}
          />
          <button
            onClick={fetchThemeById}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar Tema"}
          </button>
        </div>

        {specificTheme && (
          <div>
            <h3>Tema Encontrado:</h3>
            <div>
              <p><strong>ID:</strong> {specificTheme.id}</p>
              <p><strong>Título:</strong> {specificTheme.title}</p>
              <p><strong>Descrição:</strong> {specificTheme.description}</p>
              <p><strong>User ID:</strong> {specificTheme.user_id}</p>
              <p><strong>Criado em:</strong> {new Date(specificTheme.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </section>

      {/* Seção: Listar Todos os Temas */}
      <section>
        <h2>Todos os Temas</h2>
        
        <button
          onClick={fetchAllThemes}
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar Lista"}
        </button>

        {allThemes.length > 0 ? (
          <div>
            {allThemes.map((theme) => (
              <div key={theme.id}>
                <h3>{theme.title}</h3>
                <p><strong>ID:</strong> {theme.id}</p>
                <p><strong>Descrição:</strong> {theme.description}</p>
                <p><strong>User ID:</strong> {theme.user_id}</p>
                <p><strong>Criado em:</strong> {new Date(theme.created_at).toLocaleString()}</p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum tema encontrado</p>
        )}
      </section>

      {/* Seção: Tema Criado com Sucesso */}
      {createdTheme && (
        <section>
          <h2>Tema criado com sucesso!</h2>
          <div>
            <p><strong>ID:</strong> {createdTheme.id}</p>
            <p><strong>Título:</strong> {createdTheme.title}</p>
            <p><strong>Descrição:</strong> {createdTheme.description}</p>
            <p><strong>User ID:</strong> {createdTheme.user_id}</p>
            <p><strong>Criado em:</strong> {new Date(createdTheme.created_at).toLocaleString()}</p>
          </div>
        </section>
      )}

      {/* Seção: Erro */}
      {error && (
        <div>
          <h2>Erro</h2>
          <p>Erro: {error}</p>
        </div>
      )}
    </div>
  );
}