import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.headers
            .get("authorization")
            ?.replace("Bearer ", "");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Token de acesso não fornecido" },
                { status: 401 }
            );
        }

        const apiUrl = getApiUrl("/themes");

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json(
                { error: errorData?.error || "Erro ao buscar temas" },
                { status: response.status }
            );
        }

        const themes = await response.json();
        return NextResponse.json(themes);
    } catch (error) {
        console.error("Erro na rota GET /api/themes:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.headers
            .get("authorization")
            ?.replace("Bearer ", "");

        if (!accessToken) {
            return NextResponse.json(
                { error: "Token de acesso não fornecido" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const apiUrl = getApiUrl("/themes");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json(
                { error: errorData?.error || "Erro ao criar tema" },
                { status: response.status }
            );
        }

        const newTheme = await response.json();
        return NextResponse.json(newTheme, { status: 201 });
    } catch (error) {
        console.error("Erro na rota POST /api/themes:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
