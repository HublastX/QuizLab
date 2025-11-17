from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.controller.quiz.create_quiz_text import create_quiz_text
from app.api.controller.quiz.create_quiz_doc  import create_quiz_doc
from app.api.dependencies.auth import get_current_user
from app.model.user_model import User
from app.schemas.quiz_schemas import CreateQuizDocSchema, CreateQuizSchema, QuizResponseSchema

router = APIRouter()


@router.post("/text", response_model=QuizResponseSchema)
def create_quiz_route(
    data: CreateQuizSchema,
    #current_user: User = Depends(get_current_user)
):
    return create_quiz_text(data)


@router.post("/document", response_model=QuizResponseSchema)
async def create_quiz_doc_route(
    document: UploadFile = File(...),
    num_questions: int = Form(default=5),
    num_alternatives: int = Form(default=4),
    #current_user: User = Depends(get_current_user)
):
    data = CreateQuizDocSchema(
        num_questions=num_questions,
        num_alternatives=num_alternatives
    )
    return await create_quiz_doc(document, data)

