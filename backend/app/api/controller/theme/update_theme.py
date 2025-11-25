from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.theme_repository import ThemeRepository
from app.schemas.theme_schemas import ThemeUpdateSchema, ThemeResponseSchema


def update_theme(
    theme_id: str,
    user_id: str,
    data: ThemeUpdateSchema,
    db: Session
) -> ThemeResponseSchema:

    try:
        repository = ThemeRepository(db)
        theme = repository.get_theme_by_id(theme_id)

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

        if "title" in update_data and update_data["title"] is not None:
            if not update_data["title"].strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title cannot be empty"
                )

        if "description" in update_data and update_data["description"] is not None:
            if not update_data["description"].strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Description cannot be empty"
                )

        updated_theme = repository.update_theme(theme_id, update_data)

        return ThemeResponseSchema.model_validate(updated_theme)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating theme: {str(e)}"
        )
