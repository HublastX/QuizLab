# ============================
#       BUILDER STAGE
# ============================
FROM python:3.13-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT=/usr/local

RUN apt-get update && apt-get install --no-install-recommends -y \
    curl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Copia arquivos de dependências primeiro
WORKDIR /app
COPY pyproject.toml uv.lock ./



# Instala dependências sem dev
COPY --from=ghcr.io/astral-sh/uv:0.5.5 /uv /uvx /bin/
RUN uv sync --frozen --no-dev --no-install-project


# ============================
#       RUNTIME STAGE
# ============================
FROM python:3.13-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=2 \
    PYTHONMALLOC=malloc \
    MALLOC_TRIM_THRESHOLD_=131072 \
    UV_PROJECT_ENVIRONMENT=/usr/local \
    USER=uv-app-user

# Pacotes mínimos
RUN apt-get update && apt-get install --no-install-recommends -y \
    curl \
 && apt-get purge -y gcc g++ build-essential || true \
 && apt-get autoremove -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /usr/share/man/* /usr/share/doc/*

# Criar usuário sem privilégios
RUN useradd -m -s /bin/bash $USER

WORKDIR /home/$USER/app
ENV APP_DIR=/home/$USER/app
ENV PYTHONPATH=$APP_DIR

# Copiar libs instaladas
COPY --from=builder /usr/local /usr/local

# Copiar código da aplicação
COPY app/ ./app/
COPY *.py ./


RUN chown -R "$USER":"$USER" $APP_DIR
USER $USER


EXPOSE 9080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9080"]