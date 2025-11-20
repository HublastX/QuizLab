import os
import sys
from logging.config import fileConfig

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.settings.settings import settings
from app.model.user_model import User
from app.model.theme_model import Theme
from app.model.sub_topic_model import SubTopic
from app.model.questions_model import Question
from app.model.alternative_model import Alternative

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)


if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = User.metadata

# TABELA CLIENT
for table in User.metadata.tables.values():
    if table.name not in target_metadata.tables:
        target_metadata._add_table(table.name, table.schema, table)

# TABELA THREAD
for table in Theme.metadata.tables.values():
    if table.name not in target_metadata.tables:
        target_metadata._add_table(table.name, table.schema, table)

# TABELA CRM
for table in SubTopic.metadata.tables.values():
    if table.name not in target_metadata.tables:
        target_metadata._add_table(table.name, table.schema, table)

# TABELA QUESTION
for table in Question.metadata.tables.values():
    if table.name not in target_metadata.tables:
        target_metadata._add_table(table.name, table.schema, table)

# TABELA ALTERNATIVE
for table in Alternative.metadata.tables.values():
    if table.name not in target_metadata.tables:
        target_metadata._add_table(table.name, table.schema, table)

        
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
