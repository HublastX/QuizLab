// /create/question/automatico/documento.tsx
"use client";

import { useState, useRef } from "react";
import { useFormNavigation } from "@/hook/useFormNavigation";

interface DocumentoProps {
    onDataChange: (data: { file: File; num_questions: number; num_alternatives: number } | null) => void;
    onSubmit?: () => void;
}

export function Documento({ onDataChange, onSubmit }: DocumentoProps) {
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [numAlternatives, setNumAlternatives] = useState(4);

    const formRef = useRef<HTMLDivElement>(null);
    useFormNavigation(formRef, { enabled: true, onSubmit });

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
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            const validExtensions = /\.(pdf|docx|txt)$/i;
            
            if (!validTypes.includes(file.type) && !file.name.match(validExtensions)) {
                alert("Por favor, selecione um arquivo válido (PDF, DOCX ou TXT).");
                return;
            }
            setDocumentFile(file);
            updateData(file, numQuestions, numAlternatives);
        }
    };

    const handleRemoveFile = () => {
        setDocumentFile(null);
        updateData(null, numQuestions, numAlternatives);
    };

    const handleQuestionsChange = (value: number) => {
        setNumQuestions(value);
        updateData(documentFile, value, numAlternatives);
    };

    const handleAlternativesChange = (value: number) => {
        setNumAlternatives(value);
        updateData(documentFile, numQuestions, value);
    };

    const getFileIcon = () => {
        if (!documentFile) return null;
        
        const extension = documentFile.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') {
            return (
                <svg className="w-12 h-12 text-red-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        } else if (extension === 'docx') {
            return (
                <svg className="w-12 h-12 text-blue-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-12 h-12 text-gray-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    return (
        <div ref={formRef} className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Arquivo de Documento</h3>
                <p className="text-gray-600">
                    Envie um arquivo PDF, DOCX ou TXT que será usado como base para gerar as questões automaticamente
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Entre 2 e 6 alternativas</p>
                    </div>
                </div>
            </div>

            <div className="bg-layout-card border rounded-lg p-6 mb-6">
                <label htmlFor="documentInput" className="block text-sm font-medium mb-2">
                    Arquivo de Documento
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                    <input
                        id="documentInput"
                        type="file"
                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label htmlFor="documentInput" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            {documentFile ? (
                                <>
                                    {getFileIcon()}
                                    <p className="text-sm font-medium text-gray-900">{documentFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">
                                        Clique para selecionar um documento
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, DOCX ou TXT
                                    </p>
                                </>
                            )}
                        </div>
                    </label>
                </div>
                {documentFile && (
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
                            O conteúdo do documento será extraído automaticamente. Para melhores resultados, use documentos bem estruturados e com conteúdo relevante. Clique em "Finalizar" para criar o quiz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}