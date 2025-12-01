"use client";

import { useEffect } from "react";

const STORAGE_KEY = "useDyslexicFont";
const STORAGE_FONT_SIZE = "baseFontSize";

export default function AccessibilityProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Função para aplicar a fonte para dislexia
        const applyDyslexicFont = () => {
            try {
                const useDyslexic =
                    localStorage.getItem(STORAGE_KEY) === "true";
                if (useDyslexic) {
                    document.documentElement.classList.add("font-dyslexic");
                } else {
                    document.documentElement.classList.remove("font-dyslexic");
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar preferência de dislexia:",
                    error
                );
            }
        };

        // Função para aplicar o tamanho da fonte com escala proporcional
        const applyFontSize = () => {
            try {
                const BASE_FONT_SIZE = 16; // Tamanho base padrão
                const fontSize = localStorage.getItem(STORAGE_FONT_SIZE);
                if (fontSize) {
                    const fontSizeNum = Number(fontSize);
                    const scaleFactor = fontSizeNum / BASE_FONT_SIZE;

                    // Aplica o fator de escala no html para escalar todos os tamanhos proporcionalmente
                    document.documentElement.style.fontSize = `${
                        scaleFactor * 100
                    }%`;

                    // Mantém a variável CSS para compatibilidade
                    document.documentElement.style.setProperty(
                        "--base-font-size",
                        `${fontSizeNum}px`
                    );
                } else {
                    // Se não houver valor salvo, reseta para o padrão
                    document.documentElement.style.fontSize = "100%";
                    document.documentElement.style.setProperty(
                        "--base-font-size",
                        `${BASE_FONT_SIZE}px`
                    );
                }
            } catch (error) {
                console.error("Erro ao carregar tamanho da fonte:", error);
            }
        };

        // Aplica as configurações ao carregar
        applyDyslexicFont();
        applyFontSize();

        // Listener para mudanças no localStorage (sincroniza entre abas)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                applyDyslexicFont();
            } else if (e.key === STORAGE_FONT_SIZE) {
                applyFontSize();
            }
        };

        // Listener para eventos customizados (sincroniza na mesma aba)
        const handleAccessibilityChange = () => {
            applyDyslexicFont();
            applyFontSize();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener(
            "accessibilityChange",
            handleAccessibilityChange
        );

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(
                "accessibilityChange",
                handleAccessibilityChange
            );
        };
    }, []);

    return <>{children}</>;
}
