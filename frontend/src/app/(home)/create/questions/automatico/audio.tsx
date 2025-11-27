// /create/question/automatico/audio.tsx
"use client";

import { useState } from "react";

interface AudioProps {
    onDataChange: (data: { file: File; num_questions: number; num_alternatives: number } | null) => void;
}

export function Audio({ onDataChange }: AudioProps) {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [numAlternatives, setNumAlternatives] = useState(4);

    const updateData = (file: File | null, newNumQuestions: number, newNumAlternatives: number) => {
        if (file && newNumQuestions >= 1 && newNumQuestions <= 50 && newNumAlternatives >= 2 && newNumAlternatives <= 6) {
            onDataChange({
                file: file,
                num_questions: newNumQuestions,
                num_alternatives: newNumAlternatives
            });
        } else {
            onDataChange(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
            if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
                alert("Por favor, selecione um arquivo de áudio válido (MP3, WAV, OGG, M4A).");
                return;
            }
            setAudioFile(file);
            updateData(file, numQuestions, numAlternatives);
        }
    };

    const handleRemoveFile = () => {
        setAudioFile(null);
        updateData(null, numQuestions, numAlternatives);
    };

    const handleQuestionsChange = (value: number) => {
        setNumQuestions(value);
        updateData(audioFile, value, numAlternatives);
    };

    const handleAlternativesChange = (value: number) => {
        setNumAlternatives(value);
        updateData(audioFile, numQuestions, value);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Arquivo de Áudio</h3>
                <p className="text-gray-600">
                    Envie um arquivo de áudio que será transcrito e usado como base para gerar as questões automaticamente
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Entre 2 e 6 alternativas</p>
                    </div>
                </div>
            </div>

            <div className="bg-layout-card border rounded-lg p-6 mb-6">
                <label htmlFor="audioInput" className="block text-sm font-medium mb-2">
                    Arquivo de Áudio
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                        id="audioInput"
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="audioInput" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            {audioFile ? (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{audioFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Clique para selecionar um arquivo de áudio
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        MP3, WAV, OGG ou M4A
                                    </p>
                                </div>
                            )}
                        </div>
                    </label>
                </div>
                {audioFile && (
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={handleRemoveFile} 
                            className="text-xs text-red-600 hover:text-red-700"
                        >
                            Remover arquivo
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-yellow-900">Importante</p>
                        <p className="text-sm text-yellow-800">
                            O áudio será transcrito automaticamente. Para melhores resultados, use áudios com boa qualidade de som e fala clara. Clique em "Finalizar" para criar o quiz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}