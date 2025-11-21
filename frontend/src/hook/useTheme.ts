"use client";
import { CreateThemeData, Theme, UseThemeReturn } from "@/util/types/theme";
import { useState, useEffect } from "react";

export const useTheme = (): UseThemeReturn => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAccessToken = (): string => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("accessToken") || "";
        }
        return "";
    };

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const token = getAccessToken();

        if (!token) {
            throw new Error("Token de acesso não encontrado");
        }

        const config: RequestInit = {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ error: "Erro na requisição" }));
            throw new Error(
                errorData.error ||
                    `Erro ${response.status}: ${response.statusText}`
            );
        }

        return response;
    };

    const fetchThemes = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchWithAuth("/api/theme");
            const data = await response.json();
            setThemes(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao buscar temas";
            setError(errorMessage);
            setThemes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchThemeById = async (id: string): Promise<void> => {
        if (!id) {
            setError("ID do tema não fornecido");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetchWithAuth(`/api/theme/${id}`);
            const data = await response.json();
            setCurrentTheme(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao buscar tema";
            setError(errorMessage);
            setCurrentTheme(null);
        } finally {
            setLoading(false);
        }
    };

    const createTheme = async (themeData: CreateThemeData): Promise<Theme> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchWithAuth("/api/theme", {
                method: "POST",
                body: JSON.stringify(themeData),
            });

            const newTheme = await response.json();

            setThemes((prev) => [...prev, newTheme]);
            setCurrentTheme(newTheme);

            return newTheme;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao criar tema";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    const clearCurrentTheme = (): void => {
        setCurrentTheme(null);
    };

    return {
        themes,
        currentTheme,
        loading,
        error,

        fetchThemes,
        fetchThemeById,
        createTheme,
        clearError,
        clearCurrentTheme,
    };
};

export const useThemeById = (themeId?: string) => {
    const [theme, setTheme] = useState<Theme | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAccessToken = (): string => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("accessToken") || "";
        }
        return "";
    };

    useEffect(() => {
        if (!themeId) return;

        const fetchTheme = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = getAccessToken();

                if (!token) {
                    throw new Error("Token de acesso não encontrado");
                }

                const response = await fetch(`/api/theme/${themeId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response
                        .json()
                        .catch(() => ({ error: "Erro na requisição" }));
                    throw new Error(
                        errorData.error || `Erro ${response.status}`
                    );
                }

                const themeData = await response.json();
                setTheme(themeData);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Erro ao buscar tema";
                setError(errorMessage);
                setTheme(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTheme();
    }, [themeId]);

    return { theme, loading, error };
};
