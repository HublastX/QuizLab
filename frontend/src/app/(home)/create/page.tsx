"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Questions from "./questions/questions";
import { useTheme } from "@/hook/useTheme";
import { useSubTopic } from "@/hook/useSubTopic";
import { useQuestion} from "@/hook/useQuestion";
import SetQuiz from "./theme/set";

interface ThemeData {
  id?: string;
  title: string;
  description: string;
  isNew: boolean;
}

interface SubtopicData {
  id?: string;
  subTopic: string;
  description: string;
  isNew: boolean;
}

export interface QuestionData {
  text: string;
  alternatives: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

type Step = "setup" | "questions";

export default function CreateQuiz() {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [subtopicData, setSubtopicData] = useState<SubtopicData | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);

  const { createTheme } = useTheme();
  const { createSubTopic } = useSubTopic();
  const { createQuestion } = useQuestion();

  const handleNext = () => {
    if (!themeData?.title) {
      alert("Preencha o tema!");
      return;
    }

    if (!subtopicData?.subTopic) {
      alert("Preencha o subtópico!");
      return;
    }

    setCurrentStep("questions");
  };

  const handleBack = () => {
    setCurrentStep("setup");
  };

  const handleFinish = async () => {
    if (questionsData.length === 0) {
      alert("Adicione pelo menos uma questão!");
      return;
    }

    setSaving(true);
    try {
      // 1. Cria ou pega o theme
      let themeId = themeData?.id;
      if (themeData?.isNew) {
        const newTheme = await createTheme({
          title: themeData.title,
          description: themeData.description,
        });
        themeId = newTheme.id;
      }

      // 2. Cria ou pega o subtopic
      let subTopicId = subtopicData?.id;
      if (subtopicData?.isNew) {
        const newSubTopic = await createSubTopic({
          sub_topic: subtopicData.subTopic,
          description: subtopicData.description,
          theme_id: themeId!,
        });
        subTopicId = newSubTopic.id;
      }

      // 3. Cria todas as questões
      for (const question of questionsData) {
        await createQuestion({
          text: question.text,
          sub_topic_id: subTopicId!,
          alternatives: question.alternatives,
        });
      }

      alert("Quiz criado com sucesso!");
      window.location.href = "/quiz-lab/home";
      
    } catch (err) {
      console.error("Erro ao criar quiz:", err);
      alert("Erro ao criar quiz. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {currentStep === "setup" && (
        <SetQuiz
          onThemeChange={setThemeData}
          onSubtopicChange={setSubtopicData}
        />
      )}
      
      {currentStep === "questions" && (
        <Questions
          onQuestionsChange={setQuestionsData}
          questions={questionsData}
        />
      )}

      <nav className="flex justify-between mt-10">
        {currentStep === "questions" && (
          <Button variant="subtle" onClick={handleBack} disabled={saving}>
            Voltar
          </Button>
        )}
        
        {currentStep === "setup" && (
          <Button onClick={handleNext} className="ml-auto">
            Próximo
          </Button>
        )}

        {currentStep === "questions" && (
          <Button onClick={handleFinish} disabled={saving} className="ml-auto">
            {saving ? "Salvando..." : "Finalizar"}
          </Button>
        )}
      </nav>
    </div>
  );
}