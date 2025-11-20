from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.sub_topic_repository import SubTopicRepository
from app.repository.theme_repository import ThemeRepository
from app.schemas.sub_topic_schemas import SubTopicResponseSchema


def get_sub_topic_by_id(sub_topic_id: str, user_id: str, db: Session) -> SubTopicResponseSchema:
    repository = SubTopicRepository(db)
    sub_topic = repository.get_sub_topic_by_id(sub_topic_id)
    
    if not sub_topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sub topic not found"
        )
    
    theme_repository = ThemeRepository(db)
    theme = theme_repository.get_theme_by_id(sub_topic.theme_id)
    
    if not theme or theme.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return SubTopicResponseSchema.model_validate(sub_topic)


def get_sub_topics_by_theme_id(theme_id: str, user_id: str, db: Session) -> list[SubTopicResponseSchema]:
    theme_repository = ThemeRepository(db)
    theme = theme_repository.get_theme_by_id(theme_id)
    
    if not theme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theme not found"
        )
    
    if theme.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    repository = SubTopicRepository(db)
    sub_topics = repository.get_sub_topics_by_theme_id(theme_id)
    
    return [SubTopicResponseSchema.model_validate(sub_topic) for sub_topic in sub_topics]

