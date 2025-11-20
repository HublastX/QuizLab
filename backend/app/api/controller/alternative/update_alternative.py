from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.question_schemas import AlternativeUpdateSchema, AlternativeResponseSchema
from app.repository.alternative_repository import AlternativeRepository


def update_alternative(alternative_id: str, data: AlternativeUpdateSchema, db: Session) -> AlternativeResponseSchema:
    try:
        alternative_repo = AlternativeRepository(db)
        alternative = alternative_repo.get_alternative_by_id(alternative_id)
        
        if not alternative:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alternative not found"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        updated_alternative = alternative_repo.update_alternative(alternative_id, update_data)
        
        return AlternativeResponseSchema.model_validate(updated_alternative)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating alternative: {str(e)}"
        )

