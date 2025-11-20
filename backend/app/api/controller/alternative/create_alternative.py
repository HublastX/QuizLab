from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.question_schemas import AlternativeCreateSchema, AlternativeResponseSchema
from app.repository.alternative_repository import AlternativeRepository
from app.repository.question_repository import QuestionRepository


def create_alternative(question_id: str, data: AlternativeCreateSchema, db: Session) -> AlternativeResponseSchema:
    try:
        question_repo = QuestionRepository(db)
        question = question_repo.get_question_by_id(question_id)
        
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        alternative_repo = AlternativeRepository(db)
        alternative_data = data.model_dump()
        
        alternative = alternative_repo.create_alternative(
            question_id=question_id,
            alternative_data=alternative_data
        )
        
        return AlternativeResponseSchema.model_validate(alternative)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating alternative: {str(e)}"
        )

