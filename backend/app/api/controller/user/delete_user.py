from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.user_repository import UserRepository


def delete_user(user_id: str, db: Session) -> dict:
    repository = UserRepository(db)

    deleted = repository.delete_user(user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {"message": "User deleted successfully"}