from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.theme.create_theme import create_theme
from app.api.dependencies.auth import get_current_user
from app.core.database.database import get_db
from app.model.user_model import User
from app.schemas.theme_schemas import ThemeCreateSchema, ThemeResponseSchema

router = APIRouter()


@router.post("", response_model=ThemeResponseSchema)
def create_theme_route(
    theme: ThemeCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_theme(theme, db, current_user.id)

