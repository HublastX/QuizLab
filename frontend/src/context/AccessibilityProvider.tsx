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
                const useDyslexic = localStorage.getItem(STORAGE_KEY) === "true";
                if (useDyslexic) {
                    document.documentElement.classList.add("font-dyslexic");
                } else {
                    document.documentElement.classList.remove("font-dyslexic");
                }
            } catch (error) {
                console.error("Erro ao carregar preferência de dislexia:", error);
            }
        };

        // Função para aplicar o tamanho da fonte
        const applyFontSize = () => {
            try {
                const fontSize = localStorage.getItem(STORAGE_FONT_SIZE);
                if (fontSize) {
                    document.documentElement.style.setProperty(
                        "--base-font-size",
                        `${fontSize}px`
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
        window.addEventListener("accessibilityChange", handleAccessibilityChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("accessibilityChange", handleAccessibilityChange);
        };
    }, []);

    return <>{children}</>;
}
