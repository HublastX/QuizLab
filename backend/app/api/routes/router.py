from fastapi import FastAPI

from app.api.routes.private.user_routes import router as private_user_router
from app.api.routes.private.quiz_routes.quiz_routes import router as quiz_router
from app.api.routes.private.theme_routes.theme_routes import router as theme_router
from app.api.routes.private.sub_topic_routes.sub_topic_routes import router as sub_topic_router
from app.api.routes.private.question_routes.question_routes import router as question_router
from app.api.routes.private.alternative_routes.alternative_routes import router as alternative_router
from app.api.routes.public.auth_routes import router as auth_router


def register_routes(app: FastAPI):
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(private_user_router, prefix="/users", tags=["users"])
    app.include_router(quiz_router, prefix="/quiz", tags=["quiz"])
    app.include_router(theme_router, prefix="/themes", tags=["themes"])
    app.include_router(sub_topic_router, prefix="/sub-topics", tags=["sub-topics"])
    app.include_router(question_router, prefix="/questions", tags=["questions"])
    app.include_router(alternative_router, prefix="/alternatives", tags=["alternatives"])
    return app