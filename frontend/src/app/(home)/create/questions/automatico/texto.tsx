// /create/question/automatico/texto.tsx
"use client";

import { useState, useRef } from "react";
import { useFormNavigation } from "@/hook/useFormNavigation";

interface TextoProps {
    onDataChange: (data: { text: string; num_questions: number; num_alternatives: number } | null) => void;
    onSubmit?: () => void;
}

export function Texto({ onDataChange, onSubmit }: TextoProps) {
    const [text, setText] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [numAlternatives, setNumAlternatives] = useState(4);

    const formRef = useRef<HTMLDivElement>(null);
    useFormNavigation(formRef, { enabled: true, onSubmit });

    // Atualiza os dados sempre que algo mudar
    const updateData = (newText: string, newNumQuestions: number, newNumAlternatives: number) => {
        if (newText.trim() && newNumQuestions >= 1 && newNumQuestions <= 50 && newNumAlternatives >= 2 && newNumAlternatives <= 6) {
            onDataChange({
                text: newText.trim(),
                num_questions: newNumQuestions,
                num_alternatives: newNumAlternatives
            });
        } else {
            onDataChange(null);
        }
    };

    const handleTextChange = (value: string) => {
        setText(value);
        updateData(value, numQuestions, numAlternatives);
    };

    const handleQuestionsChange = (value: number) => {
        setNumQuestions(value);
        updateData(text, value, numAlternatives);
    };

    const handleAlternativesChange = (value: number) => {
        setNumAlternatives(value);
        updateData(text, numQuestions, value);
    };

    return (
        <div ref={formRef} className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Texto Base</h3>
                <p className="text-gray-600">
                    Cole ou digite o texto que será usado como base para gerar as questões automaticamente
                </p>
            </div>

            <div className="bg-layout-card border rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4">Configurações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="numQuestions" className="block text-sm font-medium mb-2">
                            Número de Questões
                        </label>
                        <input
                            id="numQuestions"
                            type="number"
                            min="1"
                            max="50"
                            value={numQuestions}
                            onChange={(e) => handleQuestionsChange(Number(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Entre 1 e 50 questões</p>
                    </div>

                    <div>
                        <label htmlFor="numAlternatives" className="block text-sm font-medium mb-2">
                            Alternativas por Questão
                        </label>
                        <input
                            id="numAlternatives"
                            type="number"
                            min="2"
                            max="6"
                            value={numAlternatives}
                            onChange={(e) => handleAlternativesChange(Number(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Entre 2 e 6 alternativas</p>
                    </div>
                </div>
            </div>

            <div className="bg-layout-card border rounded-lg p-6 mb-6">
                <label htmlFor="textInput" className="block text-sm font-medium mb-2">
                    Texto Base
                </label>
                <textarea
                    id="textInput"
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full h-64 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Cole ou digite o texto aqui...&#10;&#10;Exemplo: A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química. Durante este processo, as plantas absorvem dióxido de carbono do ar e água do solo..."
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">{text.length} caracteres</p>
                    {text.length > 0 && (
                        <button onClick={() => handleTextChange("")} className="text-xs text-red-600 hover:text-red-700">
                            Limpar texto
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-yellow-900">Importante</p>
                        <p className="text-sm text-yellow-800">
                            Quanto mais detalhado e estruturado for o texto, melhores serão as questões geradas. 
                            Recomendamos textos com pelo menos 200 caracteres. Clique em "Finalizar" para criar o quiz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}