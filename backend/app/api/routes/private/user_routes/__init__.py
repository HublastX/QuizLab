from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_user
from app.model.user_model import User
from app.schemas.user_schemas import UserResponseSchema

router = APIRouter()


@router.get("/me", response_model=UserResponseSchema)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.controller.user.update_user import update_user
from app.api.controller.user.delete_user import delete_user
from app.core.database.database import get_db
from app.model.user_model import User
from app.schemas.user_schemas import UserResponseSchema, UserUpdateSchema

router = APIRouter()


@router.get("/me", response_model=UserResponseSchema)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/{user_id}", response_model=UserResponseSchema)
def update_user_route(
    user_id: str,
    data: UserUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user information (name, email, or password)."""
    return update_user(user_id, data, db)


@router.delete("/{user_id}")
def delete_user_route(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a user account."""
    return delete_user(user_id, db)
