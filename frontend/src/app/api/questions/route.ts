import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

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
    console.log("❓ [QUESTIONS] POST body:", body);

    const apiUrl = getApiUrl("/questions/");
    
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
      console.error("❌ [QUESTIONS] Erro ao criar:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao criar question" },
        { status: response.status }
      );
    }

    console.log("✅ [QUESTIONS] Question criada:", data?.id);
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("❌ [QUESTIONS] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}