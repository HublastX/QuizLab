import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso não fornecido' },
        { status: 401 }
      );
    }

    const { themeId } = params;
    
    if (!themeId) {
      return NextResponse.json(
        { error: 'ID do tema não fornecido' },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/themes/${themeId}`);
    
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
        { error: errorData?.error || 'Erro ao buscar tema' },
        { status: response.status }
      );
    }

    const theme = await response.json();
    return NextResponse.json(theme);
    
  } catch (error) {
    console.error('Erro na rota GET /api/themes/[themeId]:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}