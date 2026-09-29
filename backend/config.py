import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current or parent directory
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "").strip()
    HINDSIGHT_API_URL: str = os.getenv("HINDSIGHT_API_URL", "https://api.hindsight.vectorize.io").strip()
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "recallloop-product-memory").strip()
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
    
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "127.0.0.1")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("1", "true", "yes")

    @classmethod
    def reload(cls):
        if env_path.exists():
            load_dotenv(dotenv_path=env_path, override=True)
            cls.HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY", "").strip()
            cls.HINDSIGHT_API_URL = os.getenv("HINDSIGHT_API_URL", "https://api.hindsight.vectorize.io").strip()
            cls.HINDSIGHT_BANK_ID = os.getenv("HINDSIGHT_BANK_ID", "recallloop-product-memory").strip()
            cls.GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
            cls.GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()

settings = Settings()
