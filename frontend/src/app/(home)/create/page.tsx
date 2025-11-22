"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Theme } from "./theme/theme";
import { Subtopic } from "./subtopic/subtopic";
import Questions from "./questions/questions";

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

type Step = "theme" | "subtopic" | "questions";

export default function CreateQuiz() {
    const [currentStep, setCurrentStep] = useState<Step>("theme");
    const [themeData, setThemeData] = useState<ThemeData | null>(null);
    const [subtopicData, setSubtopicData] = useState<SubtopicData | null>(null);

    const handleNext = () => {
        if (currentStep === "theme") {
            console.log("Theme:", themeData);
            setCurrentStep("subtopic");
        } else if (currentStep === "subtopic") {
            console.log("Subtopic:", subtopicData);
            setCurrentStep("questions");
            // Aqui você pode avançar para o próximo passo ou fazer submit
        }
    };

    return (
        <div className="p-6">
            {currentStep === "theme" && <Theme onThemeChange={setThemeData} />}

            {currentStep === "subtopic" && (
                <Subtopic
                    themeId={themeData?.isNew ? undefined : themeData?.id}
                    onSubtopicChange={setSubtopicData}
                />
            )}

            {currentStep === "questions" && <Questions />}

            <nav className="flex justify-between mt-10">
                {/* Espaço vazio para alinhar o botão Próximo à direita quando não houver Voltar */}
                {currentStep === "theme" && <div />}

                <Button onClick={handleNext}>
                    {currentStep === "questions" ? "Finalizar" : "Próximo"}
                </Button>
            </nav>
        </div>
    );
}
