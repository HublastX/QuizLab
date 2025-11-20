from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.schemas.quiz_schemas import CreateQuizDocSchema, QuizResponseSchema
from app.services.extract.extract_audio import extract_text_from_audio
from app.services.llm.agente_quiz import QuizAgent
from app.repository.quiz_repository import QuizRepository


async def create_quiz_audio(audio: UploadFile, data: CreateQuizDocSchema, db: Session) -> QuizResponseSchema:
    try:
        content = await audio.read()
        
        extracted_text = extract_text_from_audio(
            data=content,
            mime_type=audio.content_type,
            filename=audio.filename
        )
        
        if not extracted_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from audio"
            )
        
        agent = QuizAgent(text=extracted_text)
        result = agent.create_quiz(
            num_questions=data.num_questions,
            num_alternatives=data.num_alternatives
        )
        
        quiz_repo = QuizRepository(db)
        quiz_repo.save_quiz(
            sub_topic_id=data.sub_topic_id,
            questions_data=result["perguntas"]
        )
        
        return QuizResponseSchema(**result)
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating quiz from audio: {str(e)}"
        )

