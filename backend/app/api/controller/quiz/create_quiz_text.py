from fastapi import HTTPException, status

from app.schemas.quiz_schemas import CreateQuizSchema, QuizResponseSchema
from app.services.llm.agente_quiz import QuizAgent


def create_quiz_text(data: CreateQuizSchema) -> QuizResponseSchema:
    try:
        agent = QuizAgent(text=data.text)
        resultado = agent.create_quiz(
            num_questions=data.num_questions,
            num_alternatives=data.num_alternatives
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
