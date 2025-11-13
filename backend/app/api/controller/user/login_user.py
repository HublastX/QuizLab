from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.settings.settings import settings
from app.repository.user_repository import UserRepository
from app.schemas.user_schemas import UserLoginSchema
from app.services.auth.jwt import create_access_token
from app.services.auth.password_cript import verify_password


async def login_user(credentials: UserLoginSchema, db: Session) -> dict:
    repository = UserRepository(db)
    user = repository.get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        extra_claims={"email": user.email},
    )
    return {"access_token": access_token, "token_type": "bearer"}