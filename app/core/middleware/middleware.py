from fastapi import FastAPI, Request

def cors_middleware(app: FastAPI):
    @app.middleware("http")
    async def cors_middleware(request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response