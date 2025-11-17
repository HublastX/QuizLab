from fastapi import HTTPException, UploadFile, status

from app.schemas.quiz_schemas import CreateQuizDocSchema, QuizResponseSchema
from app.services.extract.extract_pdf import extract_text_from_document
from app.services.llm.agente_quiz import QuizAgent


async def create_quiz_doc(document: UploadFile, data: CreateQuizDocSchema) -> QuizResponseSchema:
    try:
        content = await document.read()
        
        extracted_text = extract_text_from_document(
            data=content,
            mime_type=document.content_type,
            filename=document.filename
        )
        
        if not extracted_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from document"
            )
        
        agent = QuizAgent(text=extracted_text)
        result = agent.create_quiz(
            num_questions=data.num_questions,
            num_alternatives=data.num_alternatives
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
            detail=f"Error creating quiz: {str(e)}"
        )
