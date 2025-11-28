"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hook/useTheme";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

interface ThemeProps {
    onThemeChange: (data: {
        id?: string;
        title: string;
        description: string;
        isNew: boolean;
    }) => void;
}

export function Theme({ onThemeChange }: ThemeProps) {
    const { themes, loading, getThemes } = useTheme();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedThemeId, setSelectedThemeId] = useState("");

    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    // Ordem de navegação
    const refs = [titleRef, descriptionRef, selectRef];

    useEffect(() => {
        getThemes();
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
    }, [selectedThemeId, title, description, themes]);

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
        titleRef.current?.focus();
    };

    return (
        <div className="w-full border rounded-2xl bg-layout-card relative group">
            <div className="border-b p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Tema</h1>
                    <p>Qual é o tema do seu quiz?</p>
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
                    <label htmlFor="theme">Tema</label>
                    <Input
                        ref={titleRef}
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
                    <p>Já tem um tema que deseja usar?</p>
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <div className="relative">
                            <select
                                ref={selectRef}
                                name="themes"
                                id="themes"
                                value={selectedThemeId}
                                onChange={(e) => handleSelectChange(e.target.value)}
                                className="mt-2 p-2 rounded border bg-layout-card w-full appearance-none"
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
