from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.alternative.create_alternative import create_alternative
from app.api.controller.alternative.update_alternative import update_alternative
from app.api.controller.alternative.delete_alternative import delete_alternative
from app.core.database.database import get_db
from app.api.dependencies.auth import get_current_user
from app.model.user_model import User
from app.schemas.question_schemas import (
    AlternativeCreateSchema,
    AlternativeUpdateSchema,
    AlternativeResponseSchema
)

router = APIRouter()


@router.post("/{question_id}", response_model=AlternativeResponseSchema)
def create_alternative_route(
    question_id: str,
    data: AlternativeCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new alternative for a question."""
    return create_alternative(question_id, data, db)


@router.patch("/{alternative_id}", response_model=AlternativeResponseSchema)
def update_alternative_route(
    alternative_id: str,
    data: AlternativeUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an alternative. You can update text, correct status, or explanation."""
    return update_alternative(alternative_id, data, db)


@router.delete("/{alternative_id}")
def delete_alternative_route(
    alternative_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an alternative."""
    return delete_alternative(alternative_id, db)

