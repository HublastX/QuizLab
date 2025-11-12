import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.user_repository import UserRepository
from app.schemas.user_schemas import UserCreateSchema
from app.services.auth.password_cript import hash_password


def create_user(
    user: UserCreateSchema,
    db: Session,
):
    email = user.email
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is required")
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email address")

    repository = UserRepository(db)
    if repository.get_user_by_email(email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed_password = hash_password(user.password)
    payload = user.model_copy(update={"password": hashed_password})

    created_user = repository.create_user(payload)
    return created_user