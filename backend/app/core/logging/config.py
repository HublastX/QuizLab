import logging

from app.core.logging.logger import setup_logger

app_logger = setup_logger(
    name="app",
    level=logging.INFO,
    log_file=None,
    use_colors=True,
)

logging.getLogger().handlers = []


def get_module_logger(module_name: str):
    """
    Retorna um logger configurado para um módulo específico.

    Args:
        module_name: Nome do módulo (geralmente __name__)

    Returns:
        Logger configurado
    """
    return setup_logger(
        name=module_name,
        level=logging.INFO,
        log_file=None,
        use_colors=True,
    )
