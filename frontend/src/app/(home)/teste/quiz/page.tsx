"use client";

import { useState } from "react";
import { useQuiz } from "@/hook/useQuiz";

export default function QuizGenerator({ themeId, subTopicId }: { themeId: string; subTopicId: string }) {
  const { loading, error, createQuizFromText, createQuizFromDocument, createQuizFromAudio } = useQuiz();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Quiz a partir de texto
  const handleTextQuiz = async () => {
    const quiz = await createQuizFromText({
      text: text,
      theme_id: themeId,
      sub_topic_id: subTopicId,
      num_questions: 5,
      num_alternatives: 4,
    });
    console.log("Quiz gerado:", quiz.perguntas);
  };

  // Quiz a partir de documento (PDF, DOCX, etc)
  const handleDocumentQuiz = async () => {
    if (!file) return;
    const quiz = await createQuizFromDocument({
      file: file,
      theme_id: themeId,
      sub_topic_id: subTopicId,
      num_questions: 5,
      num_alternatives: 4,
    });
    console.log("Quiz gerado:", quiz.perguntas);
  };

  const handleAudioQuiz = async () => {
    if (!file) return;
    const quiz = await createQuizFromAudio({
      file: file,
      theme_id: themeId,
      sub_topic_id: subTopicId,
      num_questions: 5,
      num_alternatives: 4,
    });
    console.log("Quiz gerado:", quiz.perguntas);
  };

  if (loading) return <p>Gerando quiz...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      {/* Texto */}
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleTextQuiz}>Gerar Quiz do Texto</button>

      {/* Arquivo */}
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleDocumentQuiz}>Gerar Quiz do Documento</button>
      <button onClick={handleAudioQuiz}>Gerar Quiz do Áudio</button>
    </div>
  );
}