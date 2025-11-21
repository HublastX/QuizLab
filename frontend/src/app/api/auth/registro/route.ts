import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        console.log("📝 [REGISTRO] Iniciando requisição de registro");

        const body = await request.json();
        console.log("📝 [REGISTRO] Body recebido:", {
            email: body.email,
            name: body.name,
        });

        const apiUrl = getApiUrl("auth/create");
        console.log("📝 [REGISTRO] URL do backend:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        console.log(
            "📝 [REGISTRO] Status da resposta do backend:",
            response.status
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("❌ [REGISTRO] Erro do backend:", errorData);
            return NextResponse.json(
                { error: errorData?.error || "Erro ao fazer registro" },
                { status: response.status }
            );
        }

        const newRegistro = await response.json();
        console.log("✅ [REGISTRO] Registro criado com sucesso:", newRegistro);
        return NextResponse.json(newRegistro, { status: 201 });
    } catch (error) {
        console.error("❌ [REGISTRO] Erro na rota POST /auth/registro:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Erro desconhecido";
        return NextResponse.json(
            { error: `Erro interno do servidor: ${errorMessage}` },
            { status: 500 }
        );
    }
}
