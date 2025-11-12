from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

try:
    from jose import JWTError
except ImportError:
    from jose.exceptions import JWTError  # type: ignore

from app.core.database.database import get_db
from app.repository.user_repository import UserRepository
from app.services.auth.jwt import verify_token


bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials.scheme.lower() != "bearer":
        raise credentials_exception
    token = credentials.credentials
    try:
        payload = verify_token(token)
    except JWTError as exc:
        raise credentials_exception from exc

    subject = payload.get("sub")
    if subject is None:
        raise credentials_exception

    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise credentials_exception from exc

    repository = UserRepository(db)
    user = repository.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception

    return user

