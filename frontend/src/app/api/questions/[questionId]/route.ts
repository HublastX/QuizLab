import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

interface RouteParams {
  params: Promise<{ questionId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { questionId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const apiUrl = getApiUrl(`/questions/${questionId}`);
    console.log("❓ [QUESTION] GET by ID:", apiUrl);

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
      console.error("❌ [QUESTION] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Question não encontrada" },
        { status: response.status }
      );
    }

    console.log("✅ [QUESTION] Encontrada:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [QUESTION] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { questionId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const body = await request.json();
    console.log("❓ [QUESTION] PATCH:", questionId, body);

    const apiUrl = getApiUrl(`/questions/${questionId}`);
    
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
      console.error("❌ [QUESTION] Erro ao atualizar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao atualizar question" },
        { status: response.status }
      );
    }

    console.log("✅ [QUESTION] Atualizada:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [QUESTION] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { questionId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    console.log("❓ [QUESTION] DELETE:", questionId);

    const apiUrl = getApiUrl(`/questions/${questionId}`);
    
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
      console.error("❌ [QUESTION] Erro ao deletar:", data);
      return NextResponse.json(
        { error: typeof data === "object" ? data?.error || data?.message : "Erro ao deletar" },
        { status: response.status }
      );
    }

    console.log("✅ [QUESTION] Deletada:", questionId);
    return NextResponse.json({ message: data });
    
  } catch (error) {
    console.error("❌ [QUESTION] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}