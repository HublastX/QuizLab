import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

interface RouteParams {
  params: Promise<{ questionId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { questionId } = await params;
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🔘 [ALTERNATIVES] POST for question:", questionId, body);

    const apiUrl = getApiUrl(`/alternatives/${questionId}`);
    
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
      console.error("❌ [ALTERNATIVES] Erro ao criar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao criar alternative" },
        { status: response.status }
      );
    }

    console.log("✅ [ALTERNATIVES] Alternative criada:", data?.id);
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("❌ [ALTERNATIVES] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}