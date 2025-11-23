"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSubTopic } from "@/hook/useSubTopic";

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

    return (
        <div className="w-full border rounded-2xl bg-layout-card">
            <div className="border-b p-6">
                <h1 className="text-3xl font-bold">Subtema</h1>
                <p>Qual é o subtema do seu quiz?</p>
            </div>

            <div className=" p-6 gap-4 flex flex-col">
                <div>
                    <label htmlFor="subtopic">Subtema</label>
                    <Input
                        id="subtopic"
                        placeholder="Digite o subtema do seu quiz"
                        value={subTopic}
                        onChange={(e) => handleSubTopicChange(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Descrição</label>
                    <Input
                        id="description"
                        placeholder="Digite a descrição do seu quiz"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        <select
                            name="subtopics"
                            id="subtopics"
                            value={selectedSubTopicId}
                            onChange={(e) => handleSelectChange(e.target.value)}
                            className="mt-2 p-2 rounded border bg-layout-card"
                        >
                            <option value="">Selecione um subtópico</option>
                            {subTopics.map((st) => (
                                <option key={st.id} value={st.id}>
                                    {st.sub_topic}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
}
