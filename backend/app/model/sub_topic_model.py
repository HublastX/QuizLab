from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, ForeignKey, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database.database import Base


class SubTopic(Base):
    __tablename__ = "sub_topic"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )

    sub_topic: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    topic_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("topics.id"),
        nullable=False,
    )

    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
