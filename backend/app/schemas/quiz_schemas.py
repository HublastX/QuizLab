from pydantic import BaseModel, Field


class CreateQuizSchema(BaseModel):
    texto: str = Field(..., description="Texto base para criar o quiz")
    numero_perguntas: int = Field(default=5, ge=1, le=20, description="Número de perguntas a criar")
    numero_alternativas: int = Field(default=4, ge=2, le=6, description="Número de alternativas por pergunta")


class AlternativaSchema(BaseModel):
    letra: str
    texto: str
    correta: bool
    explicacao: str


class PerguntaSchema(BaseModel):
    pergunta: str
    alternativas: list[AlternativaSchema]


class QuizResponseSchema(BaseModel):
    perguntas: list[PerguntaSchema]

