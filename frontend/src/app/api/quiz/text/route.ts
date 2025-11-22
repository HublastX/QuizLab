import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🎯 [QUIZ TEXT] POST body:", body);

    const formData = new URLSearchParams();
    formData.append("text", body.text);
    formData.append("theme_id", body.theme_id);
    formData.append("sub_topic_id", body.sub_topic_id);
    if (body.num_questions) formData.append("num_questions", body.num_questions.toString());
    if (body.num_alternatives) formData.append("num_alternatives", body.num_alternatives.toString());

    const apiUrl = getApiUrl("/quiz/text");
    console.log("🎯 [QUIZ TEXT] URL:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": token,
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("❌ [QUIZ TEXT] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao criar quiz" },
        { status: response.status }
      );
    }

    console.log("✅ [QUIZ TEXT] Quiz criado:", data?.perguntas?.length, "perguntas");
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("❌ [QUIZ TEXT] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}