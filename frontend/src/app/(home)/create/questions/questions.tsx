// /create/question/questions.tsx
"use client";

import { useState, useEffect } from "react";
import AutomaticQuestions, { AutomaticModeData } from "./automatico/automatico";
import ManualQuestions from "./manual";
import { QuestionData } from "../page";
import { Button } from "@/components/ui/button";

interface QuestionsProps {
  onQuestionsChange: (questions: QuestionData[]) => void;
  onAutomaticDataChange: (data: AutomaticModeData | null) => void;
  onModeChange: (mode: "manual" | "automatic") => void;
  questions: QuestionData[];
  themeId: string;
  subTopicId: string;
  onSubmit?: () => void;
}

export default function Questions({
  onQuestionsChange,
  onAutomaticDataChange,
  onModeChange,
  questions,
  themeId,
  subTopicId,
  onSubmit,
}: QuestionsProps) {
  const [mode, setMode] = useState<"manual" | "automatic">("manual");

  useEffect(() => {
    onModeChange(mode);
  }, [mode, onModeChange]);

  return (
    <div className="overflow-hidden h-full">
      <div className="flex justify-between items-start border-b pb-6 mb-8 overflow-hidden">
        <div>
          <h1 className="text-3xl font-bold">Questões</h1>
          <p >
            Você gostaria de fazer as próprias questões ou gerar automaticamente?
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <Button
            type="button"
            onClick={() => setMode("manual")}
            size="sm"
            variant={mode === "manual" ? "solid" : "subtle"}
          >
            Manual
          </Button>
          <Button
            type="button"
            onClick={() => setMode("automatic")}
            size="sm"
            variant={mode === "automatic" ? "solid" : "subtle"}
          >
            Automático
          </Button>
        </div>
      </div>

      <div className="overflow-auto h-fit">
          {mode === "manual" ? (
            <ManualQuestions
              onQuestionsChange={onQuestionsChange}
              questions={questions}
              onSubmit={onSubmit}
            />
          ) : (
            <AutomaticQuestions
              onDataChange={onAutomaticDataChange}
            />
          )}
      </div>
    </div>
  );
}