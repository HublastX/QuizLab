import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

interface RouteParams {
  params: Promise<{ themeId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { themeId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl(`/sub-topics/theme/${themeId}`);
    console.log("📝 [SUB-TOPICS] GET by theme:", apiUrl);

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
      console.error("❌ [SUB-TOPICS] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao buscar sub-topics" },
        { status: response.status }
      );
    }

    console.log("✅ [SUB-TOPICS] Encontrados:", data?.length || 0);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [SUB-TOPICS] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}