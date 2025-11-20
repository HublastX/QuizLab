from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.question_schemas import QuestionUpdateSchema, QuestionResponseSchema
from app.repository.question_repository import QuestionRepository
from app.repository.sub_topic_repository import SubTopicRepository


def update_question(question_id: str, data: QuestionUpdateSchema, db: Session) -> QuestionResponseSchema:
    try:
        question_repo = QuestionRepository(db)
        question = question_repo.get_question_by_id(question_id)
        
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        if data.sub_topic_id:
            sub_topic_repo = SubTopicRepository(db)
            sub_topic = sub_topic_repo.get_sub_topic_by_id(data.sub_topic_id)
            
            if not sub_topic:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Sub topic not found"
                )
        
        update_data = data.model_dump(exclude_unset=True)
        updated_question = question_repo.update_question(question_id, update_data)
        
        return QuestionResponseSchema.model_validate(updated_question)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating question: {str(e)}"
        )

