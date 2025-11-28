"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useSubTopic } from "@/hook/useSubTopic";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

interface SubtopicProps {
    themeId?: string;
    onSubtopicChange: (data: {
        id?: string;
        subTopic: string;
        description: string;
        isNew: boolean;
    }) => void;
}

export function Subtopic({ themeId, onSubtopicChange }: SubtopicProps) {
    const { subTopics, loading, getSubTopicsByTheme } = useSubTopic();

    const [subTopic, setSubTopic] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSubTopicId, setSelectedSubTopicId] = useState("");

    const subtopicRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Ordem de navegação
    const refs = [subtopicRef, descriptionRef, selectRef];

    // Carrega subtopics quando tem themeId
    useEffect(() => {
        if (themeId) {
            getSubTopicsByTheme(themeId);
            setSelectedSubTopicId("");
        }
    }, [themeId]);

    // Quando muda o subtopic
    useEffect(() => {
        if (selectedSubTopicId) {
            const selected = subTopics.find(
                (st) => st.id === selectedSubTopicId
            );
            if (selected) {
                onSubtopicChange({
                    id: selected.id,
                    subTopic: selected.sub_topic,
                    description: selected.description,
                    isNew: false,
                });
            }
        } else if (subTopic) {
            onSubtopicChange({ subTopic, description, isNew: true });
        }
    }, [selectedSubTopicId, subTopic, description, subTopics]);

    // Navegação por setas
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Só ativa se o foco estiver dentro de um dos nossos inputs
            const activeElement = document.activeElement;
            const isFocusInComponent = refs.some(ref => ref.current === activeElement);
            
            if (!isFocusInComponent) return;

            const currentIndex = refs.findIndex(r => r.current === activeElement);

            if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = refs[currentIndex + 1];
                if (next && next.current) {
                    next.current.focus();
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const prev = refs[currentIndex - 1];
                if (prev && prev.current) {
                    prev.current.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [refs]);

    const handleSelectChange = (id: string) => {
        setSelectedSubTopicId(id);
        if (id) {
            setSubTopic("");
            setDescription("");
        }
    };

    const handleSubTopicChange = (value: string) => {
        setSubTopic(value);
        setSelectedSubTopicId("");
    };

    const focusFirst = () => {
        subtopicRef.current?.focus();
    };

    return (
        <div className="w-full border rounded-2xl bg-layout-card relative group">
            <div className="border-b p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Subtema</h1>
                    <p>Qual é o subtema do seu quiz?</p>
                </div>
                <button 
                    onClick={focusFirst}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-50 group-hover:opacity-100"
                    title="Focar neste bloco"
                >
                    <BsArrowDown className="text-xl" />
                </button>
            </div>

            <div className=" p-6 gap-4 flex flex-col">
                <div>
                    <label htmlFor="subtopic">Subtema</label>
                    <Input
                        ref={subtopicRef}
                        id="subtopic"
                        placeholder="Digite o subtema do seu quiz"
                        value={subTopic}
                        onChange={(e) => handleSubTopicChange(e.target.value)}
                        suffix={<BsArrowDown />}
                    />
                </div>
                <div>
                    <label htmlFor="description">Descrição</label>
                    <Input
                        ref={descriptionRef}
                        id="description"
                        placeholder="Digite a descrição do seu quiz"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        suffix={
                            <div className="flex gap-1">
                                <BsArrowUp />
                                <BsArrowDown />
                            </div>
                        }
                    />
                </div>

                
                <div className="mt-6 border-t pt-4">
                    <p>Já tem um subtópico que deseja usar?</p>
                    {!themeId ? (
                        <p className="text-gray-500 mt-2">
                            Selecione um tema primeiro
                        </p>
                    ) : loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <div className="relative">
                            <select
                                ref={selectRef}
                                name="subtopics"
                                id="subtopics"
                                value={selectedSubTopicId}
                                onChange={(e) => handleSelectChange(e.target.value)}
                                className="mt-2 p-2 rounded border bg-layout-card w-full appearance-none"
                            >
                                <option value="">Selecione um subtópico</option>
                                {subTopics.map((st) => (
                                    <option key={st.id} value={st.id}>
                                        {st.sub_topic}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50">
                                <BsArrowUp />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
