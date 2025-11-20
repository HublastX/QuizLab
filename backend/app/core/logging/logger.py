import logging
from typing import Optional

COLORS = {
    "RESET": "\033[0m",
    "INFO": "\033[94m",  # Azul
    "WARNING": "\033[93m",  # Amarelo
    "ERROR": "\033[91m",  # Vermelho
    "CRITICAL": "\033[41m\033[97m",  # Fundo vermelho, texto branco
    "DEBUG": "\033[92m",  # Verde
}


class ColorFormatter(logging.Formatter):
    """Formatador personalizado para adicionar cores aos logs no terminal"""

    def format(self, record):
        levelname = record.levelname
        if levelname in COLORS:
            record.levelname = f"{COLORS[levelname]}{levelname}{COLORS['RESET']}"
        return super().format(record)


def setup_logger(
    name: str = "app",
    level: int = logging.INFO,
    log_file: Optional[str] = None,
    use_colors: bool = True,
) -> logging.Logger:
    """
    Configura e retorna um logger personalizado com saída colorida no console.

    Args:
        name: Nome do logger
        level: Nível de log (INFO, DEBUG, etc)
        log_file: Ignorado, mantido para compatibilidade
        use_colors: Se deve usar cores no terminal

    Returns:
        Logger configurado
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if logger.handlers:
        logger.handlers.clear()

    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"

    console_handler = logging.StreamHandler()

    if use_colors:
        formatter: logging.Formatter = ColorFormatter(log_format)
    else:
        formatter = logging.Formatter(log_format)

    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger


def get_logger(
    name: str = None, level: int = None, log_file: str = None
) -> logging.Logger:
    """
    Obtém um logger configurado.

    Args:
        name: Nome do módulo/componente (opcional)
        level: Nível de log (opcional, usa o padrão se não especificado)
        log_file: Arquivo de log (opcional)

    Returns:
        Logger configurado
    """
    logger_name = name if name else "app"
    logger = logging.getLogger(logger_name)

    if level:
        logger.setLevel(level)

    _add_file_handler_if_needed(logger, log_file)

    return logger


def _add_file_handler_if_needed(logger: logging.Logger, log_file: str = None) -> None:
    """
    Adiciona um handler de arquivo ao logger se necessário.

    Args:
        logger: Logger a ser configurado
        log_file: Caminho do arquivo de log
    """
    if not log_file:
        return

    has_file_handler = any(isinstance(h, logging.FileHandler) for h in logger.handlers)
    if has_file_handler:
        return

    file_handler = logging.FileHandler(log_file)
    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
    file_handler.setFormatter(logging.Formatter(log_format))
    logger.addHandler(file_handler)
