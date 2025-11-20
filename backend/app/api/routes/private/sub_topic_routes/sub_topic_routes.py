from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.controller.sub_topic.create_sub_topic import create_sub_topic
from app.api.dependencies.auth import get_current_user
from app.core.database.database import get_db
from app.model.user_model import User
from app.schemas.sub_topic_schemas import SubTopicCreateSchema, SubTopicResponseSchema

router = APIRouter()


@router.post("", response_model=SubTopicResponseSchema)
def create_sub_topic_route(
    sub_topic: SubTopicCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_sub_topic(sub_topic, db)

