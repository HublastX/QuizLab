import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

interface RouteParams {
  params: Promise<{ subTopicId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { subTopicId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl(`/sub-topics/${subTopicId}`);
    console.log("📝 [SUB-TOPIC] GET by ID:", apiUrl);

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
      console.error("❌ [SUB-TOPIC] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Sub-topic não encontrado" },
        { status: response.status }
      );
    }

    console.log("✅ [SUB-TOPIC] Encontrado:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [SUB-TOPIC] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { subTopicId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const apiUrl = getApiUrl(`/sub-topics/${subTopicId}`);
    console.log("📝 [SUB-TOPIC] PATCH:", apiUrl, body);

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
      console.error("❌ [SUB-TOPIC] Erro ao atualizar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao atualizar sub-topic" },
        { status: response.status }
      );
    }

    console.log("✅ [SUB-TOPIC] Atualizado:", data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [SUB-TOPIC] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { subTopicId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const apiUrl = getApiUrl(`/sub-topics/${subTopicId}`);
    console.log("🗑️ [SUB-TOPIC] DELETE:", apiUrl);

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
      data = responseText ? JSON.parse(responseText) : { message: "Sub-topic deletado com sucesso" };
    } catch {
      data = { message: responseText || "Sub-topic deletado com sucesso" };
    }

    if (!response.ok) {
      console.error("❌ [SUB-TOPIC] Erro ao deletar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao deletar sub-topic" },
        { status: response.status }
      );
    }

    console.log("✅ [SUB-TOPIC] Deletado:", subTopicId);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("❌ [SUB-TOPIC] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}