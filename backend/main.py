from fastapi import FastAPI
import uvicorn
from app.api.routes.router import register_routes
from app.core.database.database import create_all_tables
from app.core.middleware.middleware import cors_middleware  
from app.core.settings.settings import settings

app = FastAPI(root_path="/quiz-lab-backend")

register_routes(app)
cors_middleware(app)
create_all_tables()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)