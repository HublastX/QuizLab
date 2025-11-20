from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = ""
    secret_key: str = "secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 86400
    llm_api_key: str = ""
    PORT: int = 9080

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()