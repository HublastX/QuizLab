from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    llm_api_key: str = ""
    PORT: int = 9080

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()