// /create/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Questions from "./questions/questions";
import { useTheme } from "@/hook/useTheme";
import { useSubTopic } from "@/hook/useSubTopic";
import { useQuestion} from "@/hook/useQuestion";
import { useQuiz } from "@/hook/useQuiz";
import SetQuiz from "./theme/set";
import { AutomaticModeData } from "./questions/automatico/automatico";
import { QuizPergunta } from "@/util/types/quiz";

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
  theme_id: string;
  sub_topic_id: string;
}

type Step = "setup" | "questions";

export default function CreateQuiz() {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [subtopicData, setSubtopicData] = useState<SubtopicData | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [automaticData, setAutomaticData] = useState<AutomaticModeData | null>(null);
  const [saving, setSaving] = useState(false);

  const { createTheme } = useTheme();
  const { createSubTopic } = useSubTopic();
  const { createQuestion } = useQuestion();
  const { createQuizFromText, createQuizFromAudio, createQuizFromDocument } = useQuiz();

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

  const convertQuizToQuestions = (quizPerguntas: QuizPergunta[]): QuestionData[] => {
    return quizPerguntas.map((pergunta) => ({
        text: pergunta.pergunta,
        alternatives: pergunta.alternativas.map((alt) => ({
            text: alt.texto,
            correct: alt.correta,
            explanation: alt.explicacao,
        })),
        theme_id: pergunta.theme_id,
        sub_topic_id: pergunta.sub_topic_id,
    }));
  };

  const handleFinish = async () => {
    // Validação
    if (isAutomatic) {
      if (!automaticData) {
        alert("Preencha os dados para geração automática!");
        return;
      }
      if (automaticData.mode === "text" && !automaticData.text) {
        alert("Preencha o texto para geração!");
        return;
      }
      if ((automaticData.mode === "audio" || automaticData.mode === "document") && !automaticData.file) {
        alert("Selecione um arquivo para geração!");
        return;
      }
    } else {
      if (questionsData.length === 0) {
        alert("Adicione pelo menos uma questão!");
        return;
      }
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

      // 3. Gera ou salva as questões
      if (isAutomatic && automaticData) {
        let generatedQuestions: QuestionData[] = [];
        let response;

        if (automaticData.mode === "text" && automaticData.text) {
          response = await createQuizFromText({
            text: automaticData.text,
            num_questions: automaticData.num_questions,
            num_alternatives: automaticData.num_alternatives,
            theme_id: themeId!,
            sub_topic_id: subTopicId!
          });
        } else if (automaticData.mode === "audio" && automaticData.file) {
          response = await createQuizFromAudio({
            file: automaticData.file,
            num_questions: automaticData.num_questions,
            num_alternatives: automaticData.num_alternatives,
            theme_id: themeId!,
            sub_topic_id: subTopicId!
          });
        } else if (automaticData.mode === "document" && automaticData.file) {
          response = await createQuizFromDocument({
            file: automaticData.file,
            num_questions: automaticData.num_questions,
            num_alternatives: automaticData.num_alternatives,
            theme_id: themeId!,
            sub_topic_id: subTopicId!
          });
        }

        if (response && response.perguntas) {
          generatedQuestions = convertQuizToQuestions(response.perguntas);
          
          // Salva as questões geradas no banco
          for (const question of generatedQuestions) {
            await createQuestion({
              text: question.text,
              sub_topic_id: subTopicId!,
              alternatives: question.alternatives,
            });
          }
        }
      } else {
        // Salva as questões manuais
        for (const question of questionsData) {
          await createQuestion({
            text: question.text,
            sub_topic_id: subTopicId!,
            alternatives: question.alternatives,
          });
        }
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
          onAutomaticDataChange={setAutomaticData}
          onModeChange={(mode) => setIsAutomatic(mode === "automatic")}
          questions={questionsData}
          themeId={themeData?.id || ""}
          subTopicId={subtopicData?.id || ""}
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
            {saving ? "Processando..." : "Finalizar"}
          </Button>
        )}
      </nav>
    </div>
  );
}