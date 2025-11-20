from __future__ import annotations

import logging
import tempfile
from pathlib import Path
from typing import Optional

from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)


def extract_text_from_audio(data: bytes, mime_type: Optional[str] = None, filename: Optional[str] = None) -> str:
    """
    Extrai texto de arquivos de áudio usando Whisper.
    
    Suporta:
    - MP3 (.mp3)
    - OGG (.ogg)
    - WAV (.wav)
    - M4A (.m4a)
    - FLAC (.flac)
    - WMA (.wma)
    """
    try:
        mt = (mime_type or '').lower()
        name = (filename or '').lower()
        
        audio_formats = ['mp3', 'ogg', 'wav', 'm4a', 'flac', 'wma', 'webm', 'opus']
        is_audio = any(fmt in mt or name.endswith(f'.{fmt}') for fmt in audio_formats)
        
        if not is_audio:
            logger.warning("Formato de áudio não suportado: mime=%s, name=%s", mime_type, filename)
            return ""
        
        suffix = None
        for fmt in audio_formats:
            if fmt in mt or name.endswith(f'.{fmt}'):
                suffix = f'.{fmt}'
                break
        
        if not suffix:
            suffix = '.mp3'
        
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
            tmp_file.write(data)
            tmp_path = tmp_file.name
        
        try:
            model = WhisperModel("base", device="cpu", compute_type="int8")
            
            segments, info = model.transcribe(
                tmp_path,
                language="pt",
                beam_size=5
            )
            
            text_parts = []
            for segment in segments:
                text_parts.append(segment.text)
            
            return " ".join(text_parts).strip()
            
        finally:
            Path(tmp_path).unlink(missing_ok=True)
            
    except Exception:
        logger.exception("Falha ao extrair texto de áudio")
        return ""
