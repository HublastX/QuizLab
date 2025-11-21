import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const apiUrl = getApiUrl("/auth/login");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json(
                { error: errorData?.error || "Erro ao fazer login" },
                { status: response.status }
            );
        }

        const newLogin = await response.json();
        return NextResponse.json(newLogin, { status: 201 });
    } catch (error) {
        console.error("Erro na rota POST /auth/login:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
