from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.alternative_repository import AlternativeRepository


def delete_alternative(alternative_id: str, db: Session) -> dict:
    alternative_repo = AlternativeRepository(db)
    
    deleted = alternative_repo.delete_alternative(alternative_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alternative not found"
        )
    
    return {"message": "Alternative deleted successfully"}

