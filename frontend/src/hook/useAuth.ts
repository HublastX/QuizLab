"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LoginCredentials,
    AuthResponse,
    RegisterCredentials,
    RegisterResponse,
} from "./../util/types/auth";
import { User } from "@/util/types/user";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const login = async (
        credentials: LoginCredentials
    ): Promise<AuthResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );
            if (!response.ok) {
                throw new Error("Falha na autenticação");
            }
            const data: AuthResponse = await response.json();

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
            }
            if (response.ok) {
                router.push("/home");
            }

            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        credentials: RegisterCredentials
    ): Promise<RegisterResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );
            if (!response.ok) {
                throw new Error("Falha no registro");
            }
            const data: RegisterResponse = await response.json();

            router.push("/login");

            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        router.push("/login");
    };

    const me = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Falha ao buscar dados do usuário");
            }
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await me();
            if (userData) {
                setUser(userData);
            }
        };
        fetchUser();
    }, []);

    const getToken = (): string | null => {
        return localStorage.getItem("access_token");
    };

    const isAuthenticated = (): boolean => {
        return !!localStorage.getItem("access_token");
    };

    return {
        login,
        register,
        logout,
        me,
        user,
        getToken,
        isAuthenticated,
        loading,
        error,
    };
};
