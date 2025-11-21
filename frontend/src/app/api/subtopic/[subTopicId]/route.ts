import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { subTopicId: string } }
) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const { subTopicId } = params;
    
    if (!subTopicId) {
      return NextResponse.json(
        { error: 'ID do subtópico não fornecido' },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/sub-topics/${subTopicId}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.error || 'Erro ao buscar subtópico' },
        { status: response.status }
      );
    }

    const subTopic = await response.json();
    return NextResponse.json(subTopic);
    
  } catch (error) {
    console.error('Erro na rota GET /api/sub-topics/[subTopicId]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}