from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.question_repository import QuestionRepository


def delete_question(question_id: str, db: Session) -> dict:
    question_repo = QuestionRepository(db)
    
    deleted = question_repo.delete_question(question_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    return {"message": "Question deleted successfully"}

