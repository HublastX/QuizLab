from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.logging.logger import get_logger
import os
import subprocess
import traceback
from alembic.config import Config
from alembic import command
import sys
from app.core.settings.settings import settings

logger = get_logger(__name__)

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_all_tables():
    Base.metadata.create_all(bind=engine)


# =====================================================
# Alembic integration
# =====================================================


def _clear_alembic_version():
    """Limpa tabela alembic_version se ela existir."""
    try:
        with engine.connect() as connection:
            # PostgreSQL syntax
            result = connection.execute(
                text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'alembic_version'
                )
                """)
            ).scalar()

            if result:
                connection.execute(text("DELETE FROM alembic_version"))
                connection.commit()
                logger.info("Tabela alembic_version limpa com sucesso.")
            else:
                logger.info(
                    "Tabela alembic_version não existe ainda — ignorando limpeza."
                )
    except Exception:
        logger.warning("Erro ao limpar alembic_version:\n%s", traceback.format_exc())


def _clear_migration_files(versions_dir):
    """Remove arquivos antigos de migration."""
    try:
        if os.path.exists(versions_dir):
            for filename in os.listdir(versions_dir):
                if filename.endswith(".py") and filename != "__init__.py":
                    os.remove(os.path.join(versions_dir, filename))
                    logger.info(f"Migration removida: {filename}")
    except Exception:
        logger.warning(
            "Erro ao limpar arquivos de migration:\n%s", traceback.format_exc()
        )


def run_migrations():
    """Cria e executa migrations automaticamente no startup."""
    versions_dir = os.path.join(os.path.dirname(__file__), "../../migrations/versions")
    os.makedirs(versions_dir, exist_ok=True)

    try:
        subprocess.run(["chmod", "-R", "777", versions_dir], check=True)
        logger.info(f"✅ Permissões garantidas em {versions_dir}")
    except Exception as e:
        logger.warning(f"⚠️ Falha ao ajustar permissões de {versions_dir}: {e}")

    # Caminho correto do alembic.ini (está em /app/app/alembic.ini dentro do container)
    alembic_ini_path = os.path.join(os.path.dirname(__file__), "../../alembic.ini")
    alembic_cfg = Config(alembic_ini_path)

    # Caminhos de migration
    script_location = os.path.join(os.path.dirname(__file__), "../../migrations")
    versions_dir = os.path.join(script_location, "versions")

    os.makedirs(script_location, exist_ok=True)
    os.makedirs(versions_dir, exist_ok=True)
    logger.info(
        f"Diretórios de migration verificados: {script_location}, {versions_dir}"
    )

    try:
        _clear_alembic_version()
        _clear_migration_files(versions_dir)

        logger.info("Gerando migration automaticamente...")
        try:

            print("=== TRACEBACK ALEMBIC START ===", flush=True)
            command.revision(
                alembic_cfg, autogenerate=True, message="Auto-generated migration"
            )
            print("=== TRACEBACK ALEMBIC END ===", flush=True)
            logger.info("✅ Migration criada automaticamente.")
        except Exception:
            tb = traceback.format_exc()
            print("=== TRACEBACK ALEMBIC CAUGHT ===", flush=True)
            print(tb, flush=True)
            print("=== TRACEBACK ALEMBIC END ===", flush=True)
            logger.error("Erro completo ao gerar migration:\n%s", tb)
            sys.stdout.flush()
            sys.stderr.flush()
            raise  # força crash para aparecer o traceback completo

        command.upgrade(alembic_cfg, "head")
        logger.info("✅ Migrations aplicadas com sucesso.")
    except Exception:
        logger.error("❌ Erro ao executar migrations:\n%s", traceback.format_exc())
        try:
            command.upgrade(alembic_cfg, "head")
        except Exception:
            logger.error("❌ Erro ao aplicar upgrade:\n%s", traceback.format_exc())
