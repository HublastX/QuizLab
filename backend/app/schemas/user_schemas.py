from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserCreateSchema(BaseModel):
    name: str
    email: str
    password: str


class UserLoginSchema(BaseModel):
    email: str
    password: str


class UserResponseSchema(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"