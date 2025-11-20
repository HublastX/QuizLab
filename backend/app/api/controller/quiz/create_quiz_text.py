from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.quiz_schemas import CreateQuizSchema, QuizResponseSchema
from app.services.llm.agente_quiz import QuizAgent
from app.repository.quiz_repository import QuizRepository


def create_quiz_text(data: CreateQuizSchema, db: Session) -> QuizResponseSchema:
    try:
        agent = QuizAgent(text=data.text)
        resultado = agent.create_quiz(
            num_questions=data.num_questions,
            num_alternatives=data.num_alternatives
        )
        
        quiz_repo = QuizRepository(db)
        quiz_repo.save_quiz(
            sub_topic_id=data.sub_topic_id,
            questions_data=resultado["perguntas"]
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
