from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ThemeCreateSchema(BaseModel):
    title: str
    description: str


class ThemeResponseSchema(BaseModel):
    id: str
    title: str
    description: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

