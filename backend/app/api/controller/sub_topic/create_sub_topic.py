from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.sub_topic_repository import SubTopicRepository
from app.repository.theme_repository import ThemeRepository
from app.schemas.sub_topic_schemas import SubTopicCreateSchema
from app.model.sub_topic_model import SubTopic


def create_sub_topic(
    sub_topic: SubTopicCreateSchema,
    db: Session,
) -> SubTopic:
    if not sub_topic.sub_topic or not sub_topic.sub_topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sub topic name is required"
        )

    theme_repository = ThemeRepository(db)
    theme = theme_repository.get_theme_by_id(sub_topic.theme_id)
    if not theme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theme not found"
        )

    repository = SubTopicRepository(db)
    created_sub_topic = repository.create_sub_topic(sub_topic)
    return created_sub_topic

