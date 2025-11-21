"use client";
import { useState } from "react";
import {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    RegisterResponse,
    UseAuthReturn,
} from "@/util/types/auth";

export const useAuth = (): UseAuthReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWithoutAuth = async (url: string, options: RequestInit = {}) => {
        const config: RequestInit = {
            ...options,
            headers: {
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

    const login = async (
        credentials: LoginCredentials
    ): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchWithoutAuth("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.access_token || data.token) {
                const token = data.access_token || data.token;
                localStorage.setItem("access_token", token);
            }

            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao fazer login";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        credentials: RegisterCredentials
    ): Promise<RegisterResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchWithoutAuth("/api/auth/registro", {
                method: "POST",
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao fazer registro";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    return {
        loading,
        error,
        login,
        register,
        clearError,
    };
};
