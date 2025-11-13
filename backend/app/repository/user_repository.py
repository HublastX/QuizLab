from sqlalchemy.orm import Session

from app.schemas.user_schemas import UserCreateSchema
from app.model.user_model import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserCreateSchema) -> User:
        """
        Create a new user in the database
        """
        new_user = User(name=user.name, email=user.email, password=user.password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user


      
    def get_user_by_id(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> User:
        return self.db.query(User).filter(User.email == email).first()