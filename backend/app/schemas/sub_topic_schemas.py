from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SubTopicCreateSchema(BaseModel):
    sub_topic: str
    description: str | None = None
    theme_id: str


class SubTopicUpdateSchema(BaseModel):
    sub_topic: str | None = None
    description: str | None = None


class SubTopicResponseSchema(BaseModel):
    id: str
    sub_topic: str
    description: str | None
    theme_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

