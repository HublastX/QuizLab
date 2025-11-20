from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.question_schemas import QuestionCreateSchema, QuestionResponseSchema
from app.repository.question_repository import QuestionRepository
from app.repository.sub_topic_repository import SubTopicRepository


def create_question(data: QuestionCreateSchema, db: Session) -> QuestionResponseSchema:
    try:
        sub_topic_repo = SubTopicRepository(db)
        sub_topic = sub_topic_repo.get_sub_topic_by_id(data.sub_topic_id)
        
        if not sub_topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sub topic not found"
            )
        
        has_correct = any(alt.correct for alt in data.alternatives)
        if not has_correct:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one alternative must be correct"
            )
        
        question_repo = QuestionRepository(db)
        alternatives_data = [alt.model_dump() for alt in data.alternatives]
        
        question = question_repo.create_question_with_alternatives(
            text=data.text,
            sub_topic_id=data.sub_topic_id,
            alternatives=alternatives_data
        )
        
        return QuestionResponseSchema.model_validate(question)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating question: {str(e)}"
        )

