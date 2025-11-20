from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.question_schemas import QuestionResponseSchema, QuestionListResponseSchema
from app.repository.question_repository import QuestionRepository


def get_question_by_id(question_id: str, db: Session) -> QuestionResponseSchema:
    question_repo = QuestionRepository(db)
    question = question_repo.get_question_by_id(question_id)
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return QuestionResponseSchema.model_validate(question)


def get_questions_by_sub_topic(sub_topic_id: str, db: Session) -> QuestionListResponseSchema:
    question_repo = QuestionRepository(db)
    questions = question_repo.get_questions_by_sub_topic(sub_topic_id)
    
    response_questions = [QuestionResponseSchema.model_validate(q) for q in questions]
    return QuestionListResponseSchema(questions=response_questions)

