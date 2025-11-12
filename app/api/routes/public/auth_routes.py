from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.user.create_user import create_user
from app.core.database.database import get_db
from app.schemas.user_schemas import (
    TokenSchema,
    UserCreateSchema,
    UserLoginSchema,
    UserResponseSchema,
)
from app.api.controller.user.login_user import login_user

router = APIRouter()

@router.post("/create", response_model=UserResponseSchema)
def create_user_route(user: UserCreateSchema, db: Session = Depends(get_db)):
    return create_user(user, db)


@router.post("/login", response_model=TokenSchema)
async def login_user_route(credentials: UserLoginSchema, db: Session = Depends(get_db)):
    return await login_user(credentials, db)