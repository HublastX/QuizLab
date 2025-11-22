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

    const apiUrl = getApiUrl(`/themes/${themeId}`);
    console.log("📚 [THEME] GET by ID:", apiUrl);

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
      console.error("❌ [THEME] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Theme não encontrado" },
        { status: response.status }
      );
    }

    console.log("✅ [THEME] Theme encontrado:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [THEME] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}
