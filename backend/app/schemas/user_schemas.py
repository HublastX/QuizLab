from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserCreateSchema(BaseModel):
    name: str
    email: str
    password: str


class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserUpdateSchema(BaseModel):
    name: str | None = None
    email: str | None = None
    password: str | None = None

class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"