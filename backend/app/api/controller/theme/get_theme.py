from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.theme_repository import ThemeRepository
from app.schemas.theme_schemas import ThemeResponseSchema


def get_theme_by_id(theme_id: str, user_id: str, db: Session) -> ThemeResponseSchema:
    repository = ThemeRepository(db)
    theme = repository.get_theme_by_id(theme_id)
    
    if not theme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theme not found"
        )
    
    if theme.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return ThemeResponseSchema.model_validate(theme)


def get_themes_by_user_id(user_id: str, db: Session) -> list[ThemeResponseSchema]:
    repository = ThemeRepository(db)
    themes = repository.get_themes_by_user_id(user_id)
    
    return [ThemeResponseSchema.model_validate(theme) for theme in themes]

