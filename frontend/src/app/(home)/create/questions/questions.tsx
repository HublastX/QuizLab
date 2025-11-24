"use client";

import { useState } from "react";
import AutomaticQuestions from "./automatico/automatico";
import ManualQuestions from "./manual";
import { QuestionData } from "../page";
import { Button } from "@/components/ui/button";

interface QuestionsProps {
  onQuestionsChange: (questions: QuestionData[]) => void;
  questions: QuestionData[];
}

export default function Questions({
  onQuestionsChange,
  questions,
}: QuestionsProps) {
  const [mode, setMode] = useState<"manual" | "automatic">("manual");

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
            />
          ) : (
            // <AutomaticQuestions onQuestionsChange={onQuestionsChange} />
            <AutomaticQuestions />
          )}
      </div>
    </div>
  );
}