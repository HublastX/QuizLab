from sqlalchemy.orm import Session

from app.model.questions_model import Question
from app.model.alternative_model import Alternative


class QuestionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_question_with_alternatives(
        self, 
        text: str, 
        sub_topic_id: str, 
        alternatives: list[dict]
    ) -> Question:
        question = Question(
            text=text,
            sub_topic_id=sub_topic_id
        )
        self.db.add(question)
        self.db.flush()
        
        for alt_data in alternatives:
            alternative = Alternative(
                text=alt_data["text"],
                correct=alt_data["correct"],
                explanation=alt_data["explanation"],
                question_id=question.id
            )
            self.db.add(alternative)
        
        self.db.commit()
        self.db.refresh(question)
        return question


    def get_question_by_id(self, question_id: str) -> Question | None:
        return self.db.query(Question).filter(Question.id == question_id).first()

    def get_questions_by_sub_topic(self, sub_topic_id: str) -> list[Question]:
        return self.db.query(Question).filter(Question.sub_topic_id == sub_topic_id).all()

    def update_question(self, question_id: str, update_data: dict) -> Question | None:
        question = self.get_question_by_id(question_id)
        if not question:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(question, key, value)
        
        self.db.commit()
        self.db.refresh(question)
        return question

    def delete_question(self, question_id: str) -> bool:
        question = self.get_question_by_id(question_id)
        if question:
            self.db.delete(question)
            self.db.commit()
            return True
        return False

