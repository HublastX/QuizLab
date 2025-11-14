from fastapi import HTTPException, status

from app.schemas.quiz_schemas import CreateQuizSchema, QuizResponseSchema
from app.services.llm.agente_quiz import AgenteQuiz


def criar_quiz(data: CreateQuizSchema) -> QuizResponseSchema:
    try:
        agente = AgenteQuiz(texto=data.texto)
        resultado = agente.criar_quiz(
            numero_perguntas=data.numero_perguntas,
            numero_alternativas=data.numero_alternativas
        )
        return QuizResponseSchema(**resultado)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao criar quiz: {str(e)}"
        )
