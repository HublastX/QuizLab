import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl("/users/me");
    console.log("👤 [USER] GET me:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("❌ [USER] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao buscar usuário" },
        { status: response.status }
      );
    }

    console.log("✅ [USER] Usuário encontrado:", data?.email);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [USER] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}