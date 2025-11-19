from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, ForeignKey, func, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database.database import Base


class SubTema(Base):
    __tablename__ = "sub_tema"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid(),
    )

    sub_tema: Mapped[str] = mapped_column(String(100), nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=True)
    ordem: Mapped[int] = mapped_column(Integer, nullable=False)

    tema_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("temas.id"),
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
