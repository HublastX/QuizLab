"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hook/useAuth";
import { useState } from "react";

export default function TesteConexao() {
    const { login, register, error, loading } = useAuth();
    const [resultado, setResultado] = useState<string>("");

    const testarConexaoRegistro = async () => {
        const response = await register({
            name: "testeUsuario",
            password: "testeSenha",
            email: "teste@email.com",
        });

        if (response) {
            setResultado("Conexão bem sucedida - Registro!");
        } else {
            setResultado("Falha no registro");
        }
    };

    const testarConexaoLogin = async () => {
        const response = await login({
            email: "teste@email.com",
            password: "testeSenha",
        });

        if (response) {
            setResultado("Conexão bem sucedida - Login!");
        } else {
            setResultado("Falha no login");
        }
    };

    return (
        <div className="grid grid-cols-2 gap-10">
            <div className="mb-10 flex flex-col gap-4">
                <h1>Teste de Conexão com o Backend</h1>
                <div className="gap-4 flex flex-col">
                    <Button
                        onClick={testarConexaoRegistro}
                        className="bg-qblue-400"
                        disabled={loading}
                    >
                        {loading
                            ? "Carregando..."
                            : "Testar Conexão - Registro"}
                    </Button>
                </div>
                <div>
                    <div className="gap-4 flex flex-col">
                        <Button
                            onClick={testarConexaoLogin}
                            className="bg-qorange-400"
                            disabled={loading}
                        >
                            {loading
                                ? "Carregando..."
                                : "Testar Conexão - Login"}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-layout-card p-4">
                <h2>Resultado:</h2>
                <p>{loading ? "Carregando..." : ""}</p>
                {error && <p className="text-red-500">Erro: {error}</p>}
                {resultado && <p className="text-green-500">{resultado}</p>}
            </div>
        </div>
    );
}
