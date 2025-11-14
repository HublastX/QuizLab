from fastapi import APIRouter, Depends

from app.api.controller.quiz.quiz import criar_quiz
from app.api.dependencies.auth import get_current_user
from app.model.user_model import User
from app.schemas.quiz_schemas import CreateQuizSchema, QuizResponseSchema

router = APIRouter()


@router.post("/", response_model=QuizResponseSchema)
def criar_quiz_route(
    data: CreateQuizSchema,
    #current_user: User = Depends(get_current_user)
):
    return criar_quiz(data)

