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


export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { themeId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiUrl = getApiUrl(`/themes/${themeId}`);
    console.log("📝 [THEME] PATCH:", apiUrl, body);

    const response = await fetch(apiUrl, {
      method: "PATCH",
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
      console.error("❌ [THEME] Erro ao atualizar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao atualizar theme" },
        { status: response.status }
      );
    }

    console.log("✅ [THEME] Theme atualizado:", data?.id);
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    console.log("🗑️ [THEME] DELETE:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = responseText ? JSON.parse(responseText) : { message: "Theme deletado com sucesso" };
    } catch {
      data = { message: responseText || "Theme deletado com sucesso" };
    }

    if (!response.ok) {
      console.error("❌ [THEME] Erro ao deletar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao deletar theme" },
        { status: response.status }
      );
    }

    console.log("✅ [THEME] Theme deletado:", themeId);
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
