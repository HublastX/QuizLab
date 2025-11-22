"use client";

import { useEffect } from "react";
import { useQuestion } from "@/hook/useQuestion";

export default function QuestionsPage({ subTopicId }: { subTopicId: string }) {
  const { 
    questions, 
    loading, 
    error, 
    getQuestionsBySubTopic, 
    createQuestion,
    updateQuestion,
    deleteQuestion 
  } = useQuestion();

  useEffect(() => {
    getQuestionsBySubTopic(subTopicId);
  }, [subTopicId]);

  const handleCreate = async () => {
    await createQuestion({
      text: "Qual a capital do Brasil?",
      sub_topic_id: subTopicId,
      alternatives: [
        { text: "São Paulo", correct: false, explanation: "É a maior cidade" },
        { text: "Brasília", correct: true, explanation: "Capital desde 1960" },
        { text: "Rio de Janeiro", correct: false, explanation: "Antiga capital" },
        { text: "Salvador", correct: false, explanation: "Primeira capital" },
      ]
    });
  };

  const handleUpdate = async (questionId: string) => {
    await updateQuestion(questionId, { text: "Texto atualizado" });
  };

  const handleDelete = async (questionId: string) => {
    await deleteQuestion(questionId);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <button onClick={handleCreate}>Criar Question</button>
      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>
          <button onClick={() => handleUpdate(q.id)}>Editar</button>
          <button onClick={() => handleDelete(q.id)}>Deletar</button>
        </div>
      ))}
    </div>
  );
}