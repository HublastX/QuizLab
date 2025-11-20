from fastapi import FastAPI
import uvicorn
from app.api.routes.router import register_routes
from app.core.middleware.middleware import cors_middleware  
from app.core.settings.settings import settings

from app.core.database.database import run_migrations
app = FastAPI(root_path="/quiz-lab-backend")

cors_middleware(app)
register_routes(app)
#create_all_tables()
run_migrations()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)