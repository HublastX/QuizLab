from sqlalchemy.orm import Session

from app.model.questions_model import Question
from app.model.alternative_model import Alternative


class QuizRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_quiz(self, sub_topic_id: str, questions_data: list[dict]) -> list[Question]:
        saved_questions = []
        
        for question_data in questions_data:
            question = Question(
                text=question_data["pergunta"],
                sub_topic_id=sub_topic_id
            )
            self.db.add(question)
            self.db.flush()
            
            for alt_data in question_data["alternativas"]:
                alternative = Alternative(
                    text=alt_data["texto"],
                    correct=alt_data["correta"],
                    explanation=alt_data["explicacao"],
                    question_id=question.id
                )
                self.db.add(alternative)
            
            saved_questions.append(question)
        
        self.db.commit()
        return saved_questions

