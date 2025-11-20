from datetime import datetime
import uuid

from sqlalchemy import DateTime, String, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database.database import Base


class SubTopic(Base):
    __tablename__ = "sub_topics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    sub_topic: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    theme_id: Mapped[str] = mapped_column(String(36), ForeignKey("themes.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    theme = relationship("Theme", back_populates="sub_topics")
    questions = relationship("Question", back_populates="sub_topic", cascade="all, delete-orphan")
