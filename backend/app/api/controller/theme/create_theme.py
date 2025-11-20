from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.theme_repository import ThemeRepository
from app.schemas.theme_schemas import ThemeCreateSchema
from app.model.theme_model import Theme


def create_theme(
    theme: ThemeCreateSchema,
    db: Session,
    user_id: str,
) -> Theme:
    if not theme.title or not theme.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )

    if not theme.description or not theme.description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description is required"
        )

    repository = ThemeRepository(db)
    created_theme = repository.create_theme(theme, user_id)
    return created_theme

