from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.question.create_question import create_question
from app.api.controller.question.update_question import update_question
from app.api.controller.question.get_questions import get_question_by_id, get_questions_by_sub_topic
from app.api.controller.question.delete_question import delete_question
from app.core.database.database import get_db
from app.schemas.question_schemas import (
    QuestionCreateSchema,
    QuestionUpdateSchema,
    QuestionResponseSchema,
    QuestionListResponseSchema
)
from app.api.dependencies.auth import get_current_user
from app.model.user_model import User

router = APIRouter()


@router.post("/", response_model=QuestionResponseSchema)
def create_question_route(
    data: QuestionCreateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a single question with multiple alternatives.
    You can create as many alternatives as you want (minimum 2).
    """
    return create_question(data, db)



@router.patch("/{question_id}", response_model=QuestionResponseSchema)
def update_question_route(
    question_id: str,
    data: QuestionUpdateSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a question's text or sub_topic_id."""
    return update_question(question_id, data, db)


@router.get("/{question_id}", response_model=QuestionResponseSchema)
def get_question_route(
    question_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single question by ID with all its alternatives."""
    return get_question_by_id(question_id, db)


@router.get("/sub-topic/{sub_topic_id}", response_model=QuestionListResponseSchema)
def get_questions_by_sub_topic_route(
    sub_topic_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all questions for a specific sub topic."""
    return get_questions_by_sub_topic(sub_topic_id, db)


@router.delete("/{question_id}")
def delete_question_route(
    question_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a question and all its alternatives."""
    return delete_question(question_id, db)

