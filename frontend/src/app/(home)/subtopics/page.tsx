"use client";

import { useTopics } from "@/hook/useTopics";
import { useState } from "react";

export default function SubTopicPageTest() {
  const { subTopics, loading, error } = useTopics();
  const [subTopicData, setSubTopicData] = useState({
    sub_topic: "",
    description: "",
    theme_id: "12345"
  });
  const [createdSubTopic, setCreatedSubTopic] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subTopicData.sub_topic.trim() || !subTopicData.description.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const result = await subTopics(subTopicData);
      setCreatedSubTopic(result);
      setSubTopicData(prev => ({ ...prev, sub_topic: "", description: "" })); // Limpa apenas subtópico e descrição
    } catch (err) {
      console.error("Erro ao criar subtópico:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubTopicData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>      
      <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            id="sub_topic"
            name="sub_topic"
            value={subTopicData.sub_topic}
            onChange={handleChange}
            placeholder="Digite o subtópico"
            disabled={loading}
          />

          <textarea
            id="description"
            name="description"
            value={subTopicData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Digite a descrição do subtópico"
            disabled={loading}
          />


          <input
            type="text"
            id="theme_id"
            name="theme_id"
            value={subTopicData.theme_id}
            onChange={handleChange}
            placeholder="Digite o ID do tema"
            disabled={loading}
          />


        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Subtópico"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          Erro: {error}
        </div>
      )}

      {createdSubTopic && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Subtópico criado com sucesso!</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>ID:</strong> {createdSubTopic.id}</p>
            <p><strong>Subtopico:</strong> {createdSubTopic.sub_topic}</p>
            <p><strong>Descrição:</strong> {createdSubTopic.description}</p>
            <p><strong>Theme ID:</strong> {createdSubTopic.theme_id}</p>
            <p><strong>Criado em:</strong> {new Date(createdSubTopic.created_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}