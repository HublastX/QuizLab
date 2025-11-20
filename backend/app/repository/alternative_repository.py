from sqlalchemy.orm import Session

from app.model.alternative_model import Alternative


class AlternativeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_alternative_by_id(self, alternative_id: str) -> Alternative | None:
        return self.db.query(Alternative).filter(Alternative.id == alternative_id).first()

    def update_alternative(self, alternative_id: str, update_data: dict) -> Alternative | None:
        alternative = self.get_alternative_by_id(alternative_id)
        if not alternative:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(alternative, key, value)
        
        self.db.commit()
        self.db.refresh(alternative)
        return alternative

    def delete_alternative(self, alternative_id: str) -> bool:
        alternative = self.get_alternative_by_id(alternative_id)
        if alternative:
            self.db.delete(alternative)
            self.db.commit()
            return True
        return False

    def create_alternative(self, question_id: str, alternative_data: dict) -> Alternative:
        alternative = Alternative(
            text=alternative_data["text"],
            correct=alternative_data["correct"],
            explanation=alternative_data["explanation"],
            question_id=question_id
        )
        self.db.add(alternative)
        self.db.commit()
        self.db.refresh(alternative)
        return alternative

