from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.sub_topic_repository import SubTopicRepository
from app.repository.theme_repository import ThemeRepository


def delete_sub_topic(sub_topic_id: str, user_id: str, db: Session) -> dict:
    try:
        repository = SubTopicRepository(db)

        sub_topic = repository.get_sub_topic_by_id(sub_topic_id)
        if not sub_topic:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sub topic not found"
            )

        theme_repository = ThemeRepository(db)
        theme = theme_repository.get_theme_by_id(sub_topic.theme_id)
        
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

        deleted = repository.delete_sub_topic(sub_topic_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sub topic not found"
            )

        return {"message": "Sub topic deleted successfully"}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting sub topic: {str(e)}"
        )

