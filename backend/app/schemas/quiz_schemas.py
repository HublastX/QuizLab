from pydantic import BaseModel, ConfigDict, Field


class CreateQuizSchema(BaseModel):
    text: str = Field(..., description="Base text to create the quiz")
    num_questions: int = Field(default=5, ge=1, le=20, description="Number of questions to create")
    num_alternatives: int = Field(default=4, ge=2, le=6, description="Number of alternatives per question")


class CreateQuizDocSchema(BaseModel):
    num_questions: int = Field(default=5, ge=1, le=20, description="Number of questions to create")
    num_alternatives: int = Field(default=4, ge=2, le=6, description="Number of alternatives per question")


class AlternativeSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    letter: str = Field(alias="letra")
    text: str = Field(alias="texto")
    correct: bool = Field(alias="correta")
    explanation: str = Field(alias="explicacao")


class QuestionSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    question: str = Field(alias="pergunta")
    alternatives: list[AlternativeSchema] = Field(alias="alternativas")


class QuizResponseSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    questions: list[QuestionSchema] = Field(alias="perguntas")

