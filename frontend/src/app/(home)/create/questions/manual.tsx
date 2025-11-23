"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuestionData } from "../page";

interface ManualQuestionsProps {
    onQuestionsChange: (questions: QuestionData[]) => void;
    questions: QuestionData[];
}

interface Alternative {
    text: string;
    correct: boolean;
    explanation: string;
}

export default function ManualQuestions({
    onQuestionsChange,
    questions,
}: ManualQuestionsProps) {
    const [questionText, setQuestionText] = useState("");
    const [alternatives, setAlternatives] = useState<Alternative[]>([
        { text: "", correct: false, explanation: "" },
        { text: "", correct: false, explanation: "" },
    ]);

    const addAlternative = () => {
        setAlternatives([
            ...alternatives,
            { text: "", correct: false, explanation: "" },
        ]);
    };

    const removeAlternative = (index: number) => {
        if (alternatives.length > 2) {
            setAlternatives(alternatives.filter((_, i) => i !== index));
        }
    };

    const updateAlternative = (
        index: number,
        field: keyof Alternative,
        value: string | boolean
    ) => {
        const newAlternatives = [...alternatives];
        newAlternatives[index] = { ...newAlternatives[index], [field]: value };
        setAlternatives(newAlternatives);
    };

    const handleAddQuestion = () => {
        // Validações
        if (!questionText.trim()) {
            alert("Digite o texto da questão!");
            return;
        }

        const filledAlternatives = alternatives.filter((alt) =>
            alt.text.trim()
        );
        if (filledAlternatives.length < 2) {
            alert("Adicione pelo menos 2 alternativas!");
            return;
        }

        const hasCorrect = filledAlternatives.some((alt) => alt.correct);
        if (!hasCorrect) {
            alert("Marque pelo menos uma alternativa como correta!");
            return;
        }

        // Adiciona à lista
        onQuestionsChange([
            ...questions,
            {
                text: questionText,
                alternatives: filledAlternatives,
            },
        ]);

        // Limpa o formulário
        setQuestionText("");
        setAlternatives([
            { text: "", correct: false, explanation: "" },
            { text: "", correct: false, explanation: "" },
        ]);

        alert("Questão adicionada! Clique em 'Finalizar' quando terminar.");
    };

    const removeQuestion = (index: number) => {
        onQuestionsChange(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 h-full overflow-hidden">
            {/* Coluna do formulário */}
            <div className="flex-1">
                <div className="w-full overflow-auto">
                    <h3 className="font-semibold mb-4">
                        Adicionar nova questão:
                    </h3>

                    <div className="space-y-2 mb-4 bg-layout-card p-6 rounded-xl shadow-sm border">
                        <label className="text-sm font-medium">
                            Nome da questão:
                        </label>
                        <Input
                            placeholder="Digite sua questão"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            aria-label="Texto da questão"
                        />
                    </div>
                    
                    <div className="space-y-4">
                        {alternatives.map((alt, index) => (
                            <div
                                key={index}
                                className="border p-6 rounded-xl space-y-4 shadow-sm bg-layout-card"
                            >
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">
                                        Alternativa {index + 1}:
                                    </label>
                                    {alternatives.length > 2 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAlternative(index)}
                                            aria-label={`Remover alternativa ${index + 1}`}
                                        >
                                            ✕ Remover
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    placeholder="Escreva sua alternativa"
                                    className="border-gray-300 focus:border-gray-400"
                                    value={alt.text}
                                    onChange={(e) =>
                                        updateAlternative(
                                            index,
                                            "text",
                                            e.target.value
                                        )
                                    }
                                    aria-label={`Texto da alternativa ${index + 1}`}
                                />
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300"
                                        checked={alt.correct}
                                        onChange={(e) =>
                                            updateAlternative(
                                                index,
                                                "correct",
                                                e.target.checked
                                            )
                                        }
                                        aria-label={`Marcar alternativa ${index + 1} como correta`}
                                    />
                                    <label className="text-sm font-medium">
                                        Está correta?
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Explicação:
                                    </label>
                                    <Input
                                        placeholder="Explique a resposta"
                                        className="border-gray-300 focus:border-gray-400"
                                        value={alt.explanation}
                                        onChange={(e) =>
                                            updateAlternative(
                                                index,
                                                "explanation",
                                                e.target.value
                                            )
                                        }
                                        aria-label={`Explicação da alternativa ${index + 1}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant="subtle"
                            onClick={addAlternative}
                            className="w-full"
                            aria-label="Adicionar nova alternativa"
                        >
                            + Adicionar Alternativa
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Button 
                            onClick={handleAddQuestion} 
                            className="w-full"
                            aria-label="Salvar questão e criar mais uma"
                        >
                            Salvar e criar mais uma questão
                        </Button>
                    </div>
                </div>
            </div>

            {/* Coluna das questões salvas */}
            <div className="flex-1 bg-layout-card rounded-2xl p-6 flex-col">
                <h3 className="font-semibold mb-4">
                    Questões adicionadas: {questions.length}
                </h3>
                
                {questions.length > 0 ? (
                    <div className="space-y-2">
                        {questions.map((q, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center py-3 px-4 border border-gray-200 hover:bg-gray-50 rounded-lg"
                            >
                                <span className="text-sm flex-1">
                                    <strong>{idx + 1}.</strong> {q.text.substring(0, 50)}
                                    {q.text.length > 50 && "..."}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuestion(idx)}
                                    className="ml-2 flex-shrink-0"
                                    aria-label={`Remover questão ${idx + 1}`}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Nenhuma questão adicionada ainda
                    </div>
                )}
            </div>
        </div>
    );
}