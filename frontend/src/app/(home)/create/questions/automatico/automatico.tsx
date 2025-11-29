"use client";

import { Texto } from "./texto";
import { Documento } from "./documento";
import { Audio } from "./audio";

export type GenerationMode = "text" | "document" | "audio" | null;

export interface AutomaticModeData {
    mode: "text" | "audio" | "document";
    text?: string;
    file?: File;
    num_questions: number;
    num_alternatives: number;
}

interface AutomaticQuestionsProps {
    mode: GenerationMode;
    onModeSelect: (mode: GenerationMode) => void;
    onDataChange: (data: AutomaticModeData | null) => void;
    onSubmit?: () => void;
}

export default function AutomaticQuestions({ mode, onModeSelect, onDataChange, onSubmit }: AutomaticQuestionsProps) {

    const handleDataChange = (data: { text?: string; file?: File; num_questions: number; num_alternatives: number } | null) => {
        if (data && mode) {
            onDataChange({
                mode: mode,
                ...data
            });
        } else {
            onDataChange(null);
        }
    };

    if (mode === "text") {
        return (
            <Texto
                onDataChange={handleDataChange}
                onSubmit={onSubmit}
            />
        );
    }

    if (mode === "document") {
        return (
            <Documento
                onDataChange={handleDataChange}
                onSubmit={onSubmit}
            />
        );
    }

    if (mode === "audio") {
        return (
            <Audio
                onDataChange={handleDataChange}
                onSubmit={onSubmit}
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">
                    Geração Automática de Questões
                </h2>
                <p>
                    Escolha como você deseja gerar as questões automaticamente
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Opção: Texto */}
                <button
                    onClick={() => onModeSelect("text")}
                    className="group bg-layout-card border-2  rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
                >
                    <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                        <svg
                            className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Texto</h3>
                    <p className="text-sm ">
                        Cole ou digite um texto e gere questões automaticamente
                        com IA
                    </p>
                </button>

                {/* Opção: Documento */}
                <button
                    onClick={() => onModeSelect("document")}
                    className="group bg-layout-card border-2  rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left"
                >
                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                        <svg
                            className="w-7 h-7 text-green-600 group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Documento</h3>
                    <p className="text-sm ">
                        Faça upload de PDF, DOCX ou TXT para gerar questões
                    </p>
                </button>

                {/* Opção: Áudio */}
                <button
                    onClick={() => onModeSelect("audio")}
                    className="group bg-layout-card border-2  rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-200 text-left"
                >
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                        <svg
                            className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Áudio</h3>
                    <p className="text-sm ">
                        Envie um arquivo de áudio para transcrever e gerar
                        questões
                    </p>
                </button>
            </div>
        </div>
    );
}
