from fastapi import FastAPI

from app.api.routes.private.user_routes import router as private_user_router
from app.api.routes.public.auth_routes import router as auth_router


def register_routes(app: FastAPI):
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(private_user_router, prefix="/users", tags=["users"])
    return app