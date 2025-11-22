import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

// POST /api/quiz/document - Cria quiz a partir de documento
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    
    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    // Recebe FormData do frontend
    const formData = await request.formData();
    console.log("📄 [QUIZ DOC] POST formData recebido");

    // Cria novo FormData para enviar ao backend
    const backendFormData = new FormData();
    
    const document = formData.get("document");
    const themeId = formData.get("theme_id");
    const subTopicId = formData.get("sub_topic_id");
    const numQuestions = formData.get("num_questions");
    const numAlternatives = formData.get("num_alternatives");

    if (document) backendFormData.append("document", document);
    if (themeId) backendFormData.append("theme_id", themeId.toString());
    if (subTopicId) backendFormData.append("sub_topic_id", subTopicId.toString());
    if (numQuestions) backendFormData.append("num_questions", numQuestions.toString());
    if (numAlternatives) backendFormData.append("num_alternatives", numAlternatives.toString());

    const apiUrl = getApiUrl("/quiz/document");
    console.log("📄 [QUIZ DOC] URL:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": token,
        // NÃO definir Content-Type - o fetch define automaticamente com boundary
      },
      body: backendFormData,
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error("❌ [QUIZ DOC] Erro:", data);
      return NextResponse.json(
        { error: data?.error || data?.message || "Erro ao criar quiz" },
        { status: response.status }
      );
    }

    console.log("✅ [QUIZ DOC] Quiz criado:", data?.perguntas?.length, "perguntas");
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("❌ [QUIZ DOC] Erro interno:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: `Erro interno: ${errorMessage}` }, { status: 500 });
  }
}