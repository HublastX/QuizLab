from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class AlternativeCreateSchema(BaseModel):
    text: str = Field(..., min_length=1, max_length=255)
    correct: bool
    explanation: str = Field(..., min_length=1, max_length=500)


class AlternativeUpdateSchema(BaseModel):
    text: str | None = Field(None, min_length=1, max_length=255)
    correct: bool | None = None
    explanation: str | None = Field(None, min_length=1, max_length=500)


class AlternativeResponseSchema(BaseModel):
    id: str
    text: str
    correct: bool
    explanation: str
    question_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuestionCreateSchema(BaseModel):
    text: str = Field(..., min_length=1)
    sub_topic_id: str
    alternatives: list[AlternativeCreateSchema] = Field(..., min_items=2)


class QuestionUpdateSchema(BaseModel):
    text: str | None = Field(None, min_length=1)
    sub_topic_id: str | None = None


class QuestionResponseSchema(BaseModel):
    id: str
    text: str
    sub_topic_id: str
    created_at: datetime
    updated_at: datetime
    alternatives: list[AlternativeResponseSchema] = []

    model_config = ConfigDict(from_attributes=True)


class QuestionListResponseSchema(BaseModel):
    questions: list[QuestionResponseSchema]

