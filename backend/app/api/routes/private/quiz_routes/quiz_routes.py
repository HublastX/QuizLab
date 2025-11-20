from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.api.controller.quiz.create_quiz_text import create_quiz_text
from app.api.controller.quiz.create_quiz_doc  import create_quiz_doc
from app.api.controller.quiz.create_quiz_audio import create_quiz_audio
from app.core.database.database import get_db
from app.schemas.quiz_schemas import CreateQuizDocSchema, CreateQuizSchema, QuizResponseSchema

router = APIRouter()


@router.post("/text", response_model=QuizResponseSchema)
def create_quiz_route(
    text: str = Form(...),
    theme_id: str = Form(...),
    sub_topic_id: str = Form(...),
    num_questions: int = Form(default=5),
    num_alternatives: int = Form(default=4),
    db: Session = Depends(get_db),
    #current_user: User = Depends(get_current_user)
):
    data = CreateQuizSchema(
        text=text,
        theme_id=theme_id,
        sub_topic_id=sub_topic_id,
        num_questions=num_questions,
        num_alternatives=num_alternatives
    )
    return create_quiz_text(data, db)


@router.post("/document", response_model=QuizResponseSchema)
async def create_quiz_doc_route(
    document: UploadFile = File(...),
    theme_id: str = Form(...),
    sub_topic_id: str = Form(...),
    num_questions: int = Form(default=5),
    num_alternatives: int = Form(default=4),
    db: Session = Depends(get_db),
    #current_user: User = Depends(get_current_user)
):
    data = CreateQuizDocSchema(
        theme_id=theme_id,
        sub_topic_id=sub_topic_id,
        num_questions=num_questions,
        num_alternatives=num_alternatives
    )
    return await create_quiz_doc(document, data, db)


@router.post("/audio", response_model=QuizResponseSchema)
async def create_quiz_audio_route(
    audio: UploadFile = File(...),
    theme_id: str = Form(...),
    sub_topic_id: str = Form(...),
    num_questions: int = Form(default=5),
    num_alternatives: int = Form(default=4),
    db: Session = Depends(get_db),
    #current_user: User = Depends(get_current_user)
):
    data = CreateQuizDocSchema(
        theme_id=theme_id,
        sub_topic_id=sub_topic_id,
        num_questions=num_questions,
        num_alternatives=num_alternatives
    )
    return await create_quiz_audio(audio, data, db)
