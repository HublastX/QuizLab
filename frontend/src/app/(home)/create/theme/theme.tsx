"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hook/useTheme";
import { useFormNavigation } from "@/hook/useFormNavigation";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

interface ThemeProps {
    onThemeChange: (data: {
        id?: string;
        title: string;
        description: string;
        isNew: boolean;
    }) => void;
    onSubmit?: () => void;
}

export function Theme({ onThemeChange, onSubmit }: ThemeProps) {
    const { themes, loading, getThemes } = useTheme();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedThemeId, setSelectedThemeId] = useState("");

    const formRef = useRef<HTMLDivElement>(null);

    // Usa o hook de navegação por teclado
    useFormNavigation(formRef, { enabled: true, onSubmit });

    useEffect(() => {
        getThemes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedThemeId) {
            const selected = themes.find((t) => t.id === selectedThemeId);
            if (selected) {
                onThemeChange({
                    id: selected.id,
                    title: selected.title,
                    description: selected.description,
                    isNew: false,
                });
            }
        } else if (title) {
            onThemeChange({ title, description, isNew: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedThemeId, title, description, themes]);

    const handleSelectChange = (id: string) => {
        setSelectedThemeId(id);
        if (id) {
            setTitle("");
            setDescription("");
        }
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        setSelectedThemeId("");
    };

    const focusFirst = () => {
        formRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    };

    return (
        <div ref={formRef} className="w-full border rounded-2xl bg-layout-card relative group">
            <div className="border-b p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Tema</h1>
                    <p>Qual é o tema do seu quiz?</p>
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
                    <label htmlFor="theme">Tema</label>
                    <Input
                        id="theme"
                        placeholder="Digite o tema do seu quiz"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
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
                    <p>Já tem um tema que deseja usar?</p>
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <div className="relative">
                            <select
                                name="themes"
                                id="themes"
                                value={selectedThemeId}
                                onChange={(e) => handleSelectChange(e.target.value)}
                                className="mt-2 p-2 rounded border bg-layout-card w-full appearance-none cursor-pointer"
                            >
                                <option value="">Selecione um tema</option>
                                {themes.map((theme) => (
                                    <option key={theme.id} value={theme.id}>
                                        {theme.title}
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
