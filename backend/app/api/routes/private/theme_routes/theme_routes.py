from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.theme.create_theme import create_theme
from app.api.controller.theme.get_theme import get_theme_by_id, get_themes_by_user_id
from app.api.controller.theme.update_theme import update_theme 
from app.api.controller.theme.delete_theme import delete_theme

from app.api.dependencies.auth import get_current_user
from app.core.database.database import get_db
from app.model.user_model import User
from app.schemas.theme_schemas import ThemeCreateSchema, ThemeResponseSchema, ThemeUpdateSchema

router = APIRouter()


@router.post("", response_model=ThemeResponseSchema)
def create_theme_route(
    theme: ThemeCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_theme(theme, db, current_user.id)


@router.get("/{theme_id}", response_model=ThemeResponseSchema)
def get_theme_by_id_route(
    theme_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_theme_by_id(theme_id, current_user.id, db)


@router.get("", response_model=list[ThemeResponseSchema])
def get_themes_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_themes_by_user_id(current_user.id, db)


@router.patch("/{theme_id}", response_model=ThemeResponseSchema)
def update_theme_route(
    theme_id: str,
    theme_update: ThemeUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_theme(theme_id, current_user.id, theme_update, db)

@router.delete("/{theme_id}")
def delete_theme_route(
    theme_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_theme(theme_id, current_user.id, db)
    return {"message": "Theme deleted successfully"}
