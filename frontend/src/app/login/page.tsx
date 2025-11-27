"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { BsArrowDown, BsArrowUp, BsArrowReturnLeft } from "react-icons/bs";

export default function Login() {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await login({ email, password });

        if (response) {
            console.log("Login successful:", response);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Seta para cima - foca no email
            if (e.key === "ArrowUp") {
                e.preventDefault();
                emailRef.current?.focus();
            }
            // Seta para baixo - foca na senha
            else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (document.activeElement === emailRef.current) {
                    passwordRef.current?.focus();
                } else {
                    emailRef.current?.focus();
                }
            }
            else if ((e.key === "ArrowReturnLeft" || e.key === "Enter") && 
                     document.activeElement !== emailRef.current && 
                     document.activeElement !== passwordRef.current) {
                e.preventDefault();
                if (!loading) {
                    buttonRef.current?.click();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [loading]);

    return (
        <div className="flex flex-col items-center justify-center">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}
            <h1 className="text-6xl font-black">Login</h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 mt-5 w-1/2 bg-layout-card p-6 rounded-lg"
            >
                <div className="grid grid-cols-1 gap-2">
                    <label>Email</label>
                    <Input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        suffix={<BsArrowUp />}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label>Senha</label>
                    <Input
                        ref={passwordRef}
                        type="password"
                        suffix={<BsArrowDown />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button
                    ref={buttonRef}
                    type="submit"
                    disabled={loading}
                    className="mt-4 hover:bg-qorange-500"
                    suffix={<BsArrowReturnLeft />}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
                <div>Novo no QuizLab? <a href="/quiz-lab/registro" className="text-qyellow-default cursor-pointer underline">Cadastre-se</a></div>
            </form>
        </div>
    );
}