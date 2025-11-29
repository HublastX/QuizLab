// /create/question/questions.tsx
"use client";

import { useState, useEffect } from "react";
import AutomaticQuestions, {
    AutomaticModeData,
    GenerationMode,
} from "./automatico/automatico";
import ManualQuestions from "./manual";
import { QuestionData } from "../page";
import { Button } from "@/components/ui/button";
import { BsPencil } from "react-icons/bs";

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
    const [currentMode, setCurrentMode] = useState<
        GenerationMode | "manual" | null
    >(null);

    useEffect(() => {
        if (currentMode === "manual") {
            onModeChange("manual");
        } else if (currentMode) {
            onModeChange("automatic");
        }
    }, [currentMode, onModeChange]);

    const handleModeSelect = (mode: GenerationMode) => {
        setCurrentMode(mode);
    };

    const handleBack = () => {
        setCurrentMode(null);
    };

    if (currentMode === "manual") {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-2"
                    >
                        ← Voltar para seleção
                    </Button>
                </div>
                <ManualQuestions
                    onQuestionsChange={onQuestionsChange}
                    questions={questions}
                    onSubmit={onSubmit}
                />
            </div>
        );
    }

    // Se for um modo automático específico (text, document, audio), renderiza o AutomaticQuestions com esse modo
    if (currentMode) {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-2"
                    >
                        ← Voltar para seleção
                    </Button>
                </div>
                <AutomaticQuestions
                    mode={currentMode}
                    onModeSelect={handleModeSelect}
                    onDataChange={onAutomaticDataChange}
                    onSubmit={onSubmit}
                />
            </div>
        );
    }

    // Se não tiver modo selecionado, mostra a tela de seleção unificada
    return (
        <div className="overflow-hidden h-full">
            <div className="overflow-auto h-fit p-1">
                {/* Renderiza o componente AutomaticQuestions no modo de seleção (null) */}
                <AutomaticQuestions
                    mode={null}
                    onModeSelect={handleModeSelect}
                    onDataChange={onAutomaticDataChange}
                />

                {/* Card Manual adicionado abaixo */}
                <div className="max-w-5xl mx-auto mt-6">
                    <h3 className="text-2xl font-bold mb-4">
                        Ou crie manualmente
                    </h3>
                    <button
                        onClick={() => setCurrentMode("manual")}
                        className="w-full group bg-layout-card border-2 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200 text-left flex items-center gap-6"
                    >
                        <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
                            <BsPencil className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">
                                Manual
                            </h3>
                            <p className="text-sm">
                                Crie suas próprias questões do zero, definindo
                                enunciados e alternativas
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
