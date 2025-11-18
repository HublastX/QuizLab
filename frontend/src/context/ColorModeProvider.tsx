"use client";

import { useEffect, useState } from "react";

const STORAGE_COLOR_MODE = "colorMode";

// Matrizes de filtros para cada tipo de daltonismo
const COLOR_FILTERS = {
    none: "none",
    protanopia: `
        brightness(1.0) 
        contrast(1.0) 
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="protanopia"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"/></filter></svg>#protanopia')
    `,
    deuteranopia: `
        brightness(1.0) 
        contrast(1.0) 
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"/></filter></svg>#deuteranopia')
    `,
    tritanopia: `
        brightness(1.0) 
        contrast(1.0) 
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="tritanopia"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"/></filter></svg>#tritanopia')
    `,
};

export default function ColorModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [colorMode, setColorMode] = useState<
        "none" | "protanopia" | "deuteranopia" | "tritanopia"
    >("none");

    // Carrega a preferência salva ao montar o componente
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
        } catch (error) {
            console.error("Erro ao carregar preferência de daltonismo:", error);
        }
    }, []);

    // Aplica o filtro de cor diretamente no body
    useEffect(() => {
        try {
            if (colorMode === "none") {
                document.body.style.filter = "";
            } else {
                const filter = COLOR_FILTERS[colorMode];
                document.body.style.filter = filter.trim();
            }
        } catch (error) {
            console.error("Erro ao aplicar filtro de daltonismo:", error);
        }
    }, [colorMode]);

    // Escuta mudanças no localStorage (mesma aba e outras abas)
    useEffect(() => {
        const handleStorageChange = () => {
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
        };

        // Escuta mudanças de outras abas
        window.addEventListener("storage", handleStorageChange);
        
        // Escuta mudanças da mesma aba (custom event)
        window.addEventListener("colorModeChange", handleStorageChange);
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("colorModeChange", handleStorageChange);
        };
    }, []);

    return <>{children}</>;
}