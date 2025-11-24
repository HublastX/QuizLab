import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.user_repository import UserRepository
from app.schemas.user_schemas import UserUpdateSchema, UserResponseSchema
from app.services.auth.password_cript import hash_password


def update_user(user_id: str, data: UserUpdateSchema, db: Session) -> UserResponseSchema:
    try:
        repository = UserRepository(db)
        user = repository.get_user_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        update_data = data.model_dump(exclude_unset=True)

        if "email" in update_data and update_data["email"]:
            email = update_data["email"]
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid email address"
                )

            existing_user = repository.get_user_by_email(email)
            if existing_user and existing_user.id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered"
                )

        if "password" in update_data and update_data["password"]:
            hashed_password = hash_password(update_data["password"])
            update_data["password"] = hashed_password

        updated_user = repository.update_user(user_id, update_data)

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return UserResponseSchema.model_validate(updated_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user: {str(e)}"
        )