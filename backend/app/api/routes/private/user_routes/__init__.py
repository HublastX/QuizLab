from fastapi import APIRouter, Depends

from app.api.dependencies.auth import get_current_user
from app.model.user_model import User
from app.schemas.user_schemas import UserResponseSchema

router = APIRouter()


@router.get("/me", response_model=UserResponseSchema)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


