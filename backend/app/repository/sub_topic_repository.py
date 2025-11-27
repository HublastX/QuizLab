from sqlalchemy.orm import Session

from app.schemas.sub_topic_schemas import SubTopicCreateSchema
from app.model.sub_topic_model import SubTopic


class SubTopicRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_sub_topic(self, sub_topic: SubTopicCreateSchema) -> SubTopic:
        try:
            new_sub_topic = SubTopic(
                sub_topic=sub_topic.sub_topic,
                description=sub_topic.description,
                theme_id=sub_topic.theme_id
            )
            self.db.add(new_sub_topic)
            self.db.commit()
            self.db.refresh(new_sub_topic)
            return new_sub_topic
        except Exception:
            self.db.rollback()
            raise

    def get_sub_topic_by_id(self, sub_topic_id: str) -> SubTopic | None:
        return self.db.query(SubTopic).filter(SubTopic.id == sub_topic_id).first()

    def get_sub_topics_by_theme_id(self, theme_id: str) -> list[SubTopic]:
        return self.db.query(SubTopic).filter(SubTopic.theme_id == theme_id).all()

    def update_sub_topic(self, sub_topic_id: str, update_data: dict) -> SubTopic | None:
        try:
            sub_topic = self.get_sub_topic_by_id(sub_topic_id)
            if not sub_topic:
                return None

            for key, value in update_data.items():
                if value is not None:
                    setattr(sub_topic, key, value)

            self.db.commit()
            self.db.refresh(sub_topic)
            return sub_topic

        except Exception:
            self.db.rollback()
            raise

    def delete_sub_topic(self, sub_topic_id: str) -> bool:
        try:
            sub_topic = self.get_sub_topic_by_id(sub_topic_id)
            if sub_topic:
                self.db.delete(sub_topic)
                self.db.commit()
                return True

            return False

        except Exception:
            self.db.rollback()
            raise

