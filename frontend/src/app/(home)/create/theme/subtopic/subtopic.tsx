"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useSubTopic } from "@/hook/useSubTopic";
import { useFormNavigation } from "@/hook/useFormNavigation";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

interface SubtopicProps {
    themeId?: string;
    onSubtopicChange: (data: {
        id?: string;
        subTopic: string;
        description: string;
        isNew: boolean;
    }) => void;
    onSubmit?: () => void;
}

export function Subtopic({ themeId, onSubtopicChange, onSubmit }: SubtopicProps) {
    const { subTopics, loading, getSubTopicsByTheme } = useSubTopic();

    const [subTopic, setSubTopic] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSubTopicId, setSelectedSubTopicId] = useState("");

    const formRef = useRef<HTMLDivElement>(null);

    // Usa o hook de navegação por teclado
    useFormNavigation(formRef, { enabled: true, onSubmit });

    // Carrega subtopics quando tem themeId
    useEffect(() => {
        if (themeId) {
            getSubTopicsByTheme(themeId);
            setSelectedSubTopicId("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSubTopicId, subTopic, description, subTopics]);

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
        formRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    };

    return (
        <div ref={formRef} className="w-full border rounded-2xl bg-layout-card relative group">
            <div className="border-b p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Subtema</h1>
                    <p>Qual é o subtema do seu quiz?</p>
                    <p className="text-xs opacity-70 mt-1">
                        Use <strong>↑↓</strong> para navegar, <strong>Enter</strong> para selecionar
                    </p>
                </div>
                <button 
                    onClick={focusFirst}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-50 group-hover:opacity-100"
                    title="Focar neste bloco"
                    type="button"
                >
                    <BsArrowDown className="text-xl" />
                </button>
            </div>

            <div className="p-6 gap-4 flex flex-col">
                <div>
                    <label htmlFor="subtopic">Subtema</label>
                    <Input
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
                                name="subtopics"
                                id="subtopics"
                                value={selectedSubTopicId}
                                onChange={(e) => handleSelectChange(e.target.value)}
                                className="mt-2 p-2 rounded border bg-layout-card w-full appearance-none cursor-pointer"
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
