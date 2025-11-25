from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.theme_repository import ThemeRepository


def delete_theme(theme_id: str, user_id: str, db: Session) -> dict:
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

        deleted = repository.delete_theme(theme_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Theme not found"
            )

        return {"message": "Theme deleted successfully"}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting theme: {str(e)}"
        )
