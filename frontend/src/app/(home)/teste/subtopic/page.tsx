"use client";

import { useEffect } from "react";
import { useSubTopic } from "@/hook/useSubTopic";

export default function SubTopicsPage({ themeId }: { themeId: string }) {
  const { subTopics, loading, error, getSubTopicsByTheme, createSubTopic } = useSubTopic();

  useEffect(() => {
    getSubTopicsByTheme(themeId);
  }, [themeId]);

  const handleCreate = async () => {
    await createSubTopic({
      sub_topic: "Meu Sub-Topic",
      description: "Descrição",
      theme_id: themeId
    });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <button onClick={handleCreate}>Criar Sub-Topic</button>
      {subTopics.map((st) => (
        <div key={st.id}>{st.sub_topic}</div>
      ))}
    </div>
  );
}