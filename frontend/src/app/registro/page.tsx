"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";

export default function Registro() {
    const { register, loading, error } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await register({ name, email, password });

        if (response) {
            console.log("Registro successful:", response);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}
            <h1 className="text-6xl font-black">Registro bem legal</h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 mt-5 w-1/2 bg-layout-card p-6"
            >
                <div className="grid grid-cols-1 gap-2">
                    <label>Nome</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label>Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <label>Senha</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    className="mt-4 hover:animate-ping"
                >
                    {loading ? "Registrando..." : "Registrar"}
                </Button>
            </form>
        </div>
    );
}
