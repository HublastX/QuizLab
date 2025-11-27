from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.sub_topic.create_sub_topic import create_sub_topic
from app.api.controller.sub_topic.get_sub_topic import get_sub_topic_by_id, get_sub_topics_by_theme_id
from app.api.controller.sub_topic.update_sub_topic import update_sub_topic
from app.api.controller.sub_topic.delete_sub_topic import delete_sub_topic
from app.api.dependencies.auth import get_current_user
from app.core.database.database import get_db
from app.model.user_model import User
from app.schemas.sub_topic_schemas import SubTopicCreateSchema, SubTopicResponseSchema, SubTopicUpdateSchema

router = APIRouter()


@router.post("", response_model=SubTopicResponseSchema)
def create_sub_topic_route(
    sub_topic: SubTopicCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_sub_topic(sub_topic, db)


@router.get("/{sub_topic_id}", response_model=SubTopicResponseSchema)
def get_sub_topic_by_id_route(
    sub_topic_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_sub_topic_by_id(sub_topic_id, current_user.id, db)


@router.get("/theme/{theme_id}", response_model=list[SubTopicResponseSchema])
def get_sub_topics_by_theme_route(
    theme_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_sub_topics_by_theme_id(theme_id, current_user.id, db)


@router.patch("/{sub_topic_id}", response_model=SubTopicResponseSchema)
def update_sub_topic_route(
    sub_topic_id: str,
    sub_topic_update: SubTopicUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_sub_topic(sub_topic_id, current_user.id, sub_topic_update, db)


@router.delete("/{sub_topic_id}")
def delete_sub_topic_route(
    sub_topic_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_sub_topic(sub_topic_id, current_user.id, db)

