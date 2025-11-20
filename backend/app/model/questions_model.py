from datetime import datetime
import uuid

from sqlalchemy import DateTime, Text, ForeignKey, func, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database.database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    sub_topic_id: Mapped[str] = mapped_column(String(36), ForeignKey("sub_topics.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    sub_topic = relationship("SubTopic", back_populates="questions")
    alternatives = relationship("Alternative", back_populates="question", cascade="all, delete-orphan")
