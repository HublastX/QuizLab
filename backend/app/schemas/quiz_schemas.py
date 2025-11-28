from pydantic import BaseModel, ConfigDict, Field, field_validator


class CreateQuizSchema(BaseModel):
    text: str = Field(..., description="Base text to create the quiz")
    theme_id: str = Field(..., description="Theme ID")
    sub_topic_id: str = Field(..., description="Sub topic ID")
    num_questions: int = Field(default=5, ge=1, le=20, description="Number of questions to create")
    num_alternatives: int = Field(default=4, ge=2, le=6, description="Number of alternatives per question")


class CreateQuizDocSchema(BaseModel):
    theme_id: str = Field(..., description="Theme ID")
    sub_topic_id: str = Field(..., description="Sub topic ID")
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
    
    @field_validator('questions')
    @classmethod
    def validate_unique_questions(cls, v):
        if not v:
            raise ValueError("Lista de questões não pode estar vazia")
        
        # Verificar se há questões duplicadas
        questions_text = [q.question.strip().lower() for q in v]
        if len(questions_text) != len(set(questions_text)):
            raise ValueError("Questões duplicadas detectadas")
        
        return v

