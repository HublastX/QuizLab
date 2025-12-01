"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const STORAGE_KEY = "useDyslexicFont";
const STORAGE_FONT_SIZE = "baseFontSize";
const STORAGE_COLOR_MODE = "colorMode";

export default function Acessibilidade() {
    const [useDys, setUseDys] = useState<boolean>(() => {
        try {
            return (
                typeof window !== "undefined" &&
                localStorage.getItem(STORAGE_KEY) === "true"
            );
        } catch {
            return false;
        }
    });

    const [fontSize, setFontSize] = useState<number>(() => {
        try {
            const v = localStorage.getItem(STORAGE_FONT_SIZE);
            return v ? Number(v) : 16;
        } catch {
            return 16;
        }
    });

    const [colorMode, setColorMode] = useState<
        "none" | "protanopia" | "deuteranopia" | "tritanopia"
    >("none");

    // Carrega o modo de cor do localStorage ao montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_COLOR_MODE) as
                | "none"
                | "protanopia"
                | "deuteranopia"
                | "tritanopia"
                | null;
            if (saved) {
                setColorMode(saved);
            }
        } catch {}
    }, []);

    //
    // Dislexia
    //
    useEffect(() => {
        try {
            if (useDys) {
                localStorage.setItem(STORAGE_KEY, "true");
                document.documentElement.classList.add("font-dyslexic");
            } else {
                localStorage.removeItem(STORAGE_KEY);
                document.documentElement.classList.remove("font-dyslexic");
            }
            // Dispara evento para sincronizar com outras páginas
            window.dispatchEvent(new Event("accessibilityChange"));
        } catch {}
    }, [useDys]);

    //
    // Tamanho da fonte - aplica escala proporcional
    //
    useEffect(() => {
        try {
            const BASE_FONT_SIZE = 16; // Tamanho base padrão
            const scaleFactor = fontSize / BASE_FONT_SIZE; // Calcula o fator de escala

            // Aplica o fator de escala no html para escalar todos os tamanhos proporcionalmente
            document.documentElement.style.fontSize = `${scaleFactor * 100}%`;

            // Mantém a variável CSS para compatibilidade
            document.documentElement.style.setProperty(
                "--base-font-size",
                `${fontSize}px`
            );

            localStorage.setItem(STORAGE_FONT_SIZE, String(fontSize));
            // Dispara evento para sincronizar com outras páginas
            window.dispatchEvent(new Event("accessibilityChange"));
        } catch {}
    }, [fontSize]);

    //
    // Daltonismo - salva no localStorage e dispara evento
    //
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_COLOR_MODE, colorMode);
            window.dispatchEvent(new Event("colorModeChange"));
        } catch {}
    }, [colorMode]);

    function increaseFont() {
        setFontSize((s) => Math.min(24, s + 1));
    }

    function decreaseFont() {
        setFontSize((s) => Math.max(12, s - 1));
    }

    return (
        <div className="bg-layout-card p-4 rounded-lg border">
            <div className="overflow-hidden">
                <div className="mb-4 md:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">
                        Configurações de Acessibilidade
                    </h1>
                </div>

                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    {/* AUMENTAR FONTE */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-hover transition-colors gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                                <span className="font-bold text-lg">A+</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    Aumentar Fonte
                                </h2>
                                <p className="text-sm text-text-secondary">
                                    Alterar o tamanho do texto
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                            <button
                                onClick={decreaseFont}
                                className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center"
                            >
                                A-
                            </button>

                            <div className="text-sm font-medium w-10 text-center">
                                {fontSize}px
                            </div>

                            <button
                                onClick={increaseFont}
                                className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center"
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    {/* DISLEXIA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-hover transition-colors gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs">Dys</span>
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    Fonte Dislexia
                                </h2>
                                <p className="text-sm text-text-secondary">
                                    Usa fonte especial para dislexia
                                </p>
                            </div>
                        </div>

                        <label className="flex items-center shrink-0">
                            <input
                                type="checkbox"
                                checked={useDys}
                                onChange={() => setUseDys(!useDys)}
                                className="sr-only"
                            />

                            <div
                                className={`w-12 h-6 rounded-full relative transition-colors ${
                                    useDys ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                            >
                                <div
                                    className={`w-6 h-6 bg-white border rounded-full absolute top-0 shadow-sm transform transition-transform ${
                                        useDys
                                            ? "translate-x-6"
                                            : "translate-x-0"
                                    }`}
                                />
                            </div>
                        </label>
                    </div>

                    {/* DALTONISMO */}
                    <div className="col-span-1 md:col-span-2 p-4 border rounded-lg">
                        <h2 className="font-semibold mb-3">Daltonismo</h2>

                        <div className="grid grid-cols-2 md:flex gap-2">
                            <Button
                                size="sm"
                                className={
                                    colorMode === "none"
                                        ? "bg-qorange-default text-qorange-text hover:bg-qorange-hover"
                                        : "bg-qblue-default text-qblue-text hover:bg-qblue-hover"
                                }
                                onClick={() => setColorMode("none")}
                            >
                                Normal
                            </Button>
                            <Button
                                size="sm"
                                className={
                                    colorMode === "protanopia"
                                        ? "bg-qorange-default text-qorange-text hover:bg-qorange-hover"
                                        : "bg-qblue-default text-qblue-text hover:bg-qblue-hover"
                                }
                                onClick={() => setColorMode("protanopia")}
                            >
                                Protanopia
                            </Button>
                            <Button
                                size="sm"
                                className={
                                    colorMode === "deuteranopia"
                                        ? "bg-qorange-default text-qorange-text hover:bg-qorange-hover"
                                        : "bg-qblue-default text-qblue-text hover:bg-qblue-hover"
                                }
                                onClick={() => setColorMode("deuteranopia")}
                            >
                                Deuteranopia
                            </Button>
                            <Button
                                size="sm"
                                className={
                                    colorMode === "tritanopia"
                                        ? "bg-qorange-default text-qorange-text hover:bg-qorange-hover"
                                        : "bg-qblue-default text-qblue-text hover:bg-qblue-hover"
                                }
                                onClick={() => setColorMode("tritanopia")}
                            >
                                Tritanopia
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
