from sqlalchemy.orm import Session

from app.schemas.theme_schemas import ThemeCreateSchema
from app.model.theme_model import Theme


class ThemeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_theme(self, theme: ThemeCreateSchema, user_id: str) -> Theme:
        try:
            new_theme = Theme(
                title=theme.title,
                description=theme.description,
                user_id=user_id
            )
            self.db.add(new_theme)
            self.db.commit()
            self.db.refresh(new_theme)
            return new_theme
        except Exception:
            self.db.rollback()
            raise

    def get_theme_by_id(self, theme_id: str) -> Theme | None:
        return self.db.query(Theme).filter(Theme.id == theme_id).first()

    def get_themes_by_user_id(self, user_id: str) -> list[Theme]:
        return self.db.query(Theme).filter(Theme.user_id == user_id).all()

