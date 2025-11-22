import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

interface RouteParams {
  params: Promise<{ alternativeId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { alternativeId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🔘 [ALTERNATIVE] PATCH:", alternativeId, body);

    const apiUrl = getApiUrl(`/alternatives/${alternativeId}`);
    
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
      console.error("❌ [ALTERNATIVE] Erro ao atualizar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao atualizar alternative" },
        { status: response.status }
      );
    }

    console.log("✅ [ALTERNATIVE] Atualizada:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [ALTERNATIVE] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { alternativeId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    console.log("🔘 [ALTERNATIVE] DELETE:", alternativeId);

    const apiUrl = getApiUrl(`/alternatives/${alternativeId}`);
    
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
      data = responseText ? JSON.parse(responseText) : responseText;
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      console.error("❌ [ALTERNATIVE] Erro ao deletar:", data);
      return NextResponse.json(
        { error: typeof data === "object" ? data?.error || data?.message : "Erro ao deletar" },
        { status: response.status }
      );
    }

    console.log("✅ [ALTERNATIVE] Deletada:", alternativeId);
    return NextResponse.json({ message: data });
    
  } catch (error) {
    console.error("❌ [ALTERNATIVE] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}