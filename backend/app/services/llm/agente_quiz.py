import google.generativeai as genai
import json
from app.services.llm.prompts.promtps import PROMPT_CRAETE_QUIZ
from app.core.settings.settings import settings


class AgenteQuiz:
    def __init__(self, texto: str):
        self.texto = texto
        genai.configure(api_key=settings.gemini_api_key)

    def criar_quiz(self, numero_perguntas: int = 5, numero_alternativas: int = 4):
        prompt = PROMPT_CRAETE_QUIZ.format(
            texto=self.texto,
            numero_perguntas=numero_perguntas,
            numero_alternativas=numero_alternativas
        )
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        response_text = response.text.strip()
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError(f"Erro ao parsear resposta do Gemini: {response_text}")