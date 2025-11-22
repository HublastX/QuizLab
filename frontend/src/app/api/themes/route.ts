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

    const apiUrl = getApiUrl("/themes");
    console.log("📚 [THEMES] GET:", apiUrl);

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
      console.error("❌ [THEMES] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao buscar themes" },
        { status: response.status }
      );
    }

    console.log("✅ [THEMES] Themes encontrados:", data?.length || 0);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [THEMES] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📚 [THEMES] POST body:", body);

    const apiUrl = getApiUrl("/themes");
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("❌ [THEMES] Erro ao criar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao criar theme" },
        { status: response.status }
      );
    }

    console.log("✅ [THEMES] Theme criado:", data);
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("❌ [THEMES] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}