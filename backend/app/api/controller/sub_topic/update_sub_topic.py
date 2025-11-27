from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.sub_topic_repository import SubTopicRepository
from app.repository.theme_repository import ThemeRepository
from app.schemas.sub_topic_schemas import SubTopicUpdateSchema, SubTopicResponseSchema


def update_sub_topic(
    sub_topic_id: str,
    user_id: str,
    data: SubTopicUpdateSchema,
    db: Session
) -> SubTopicResponseSchema:

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

        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one field must be provided for update"
            )

        if "sub_topic" in update_data and update_data["sub_topic"] is not None:
            if not update_data["sub_topic"].strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Sub topic name cannot be empty"
                )

        if "description" in update_data and update_data["description"] is not None:
            if not update_data["description"].strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Description cannot be empty"
                )

        updated_sub_topic = repository.update_sub_topic(sub_topic_id, update_data)

        return SubTopicResponseSchema.model_validate(updated_sub_topic)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating sub topic: {str(e)}"
        )

