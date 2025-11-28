import json

from app.services.llm.prompts.promtps import PROMPT_CREATE_QUIZ
from openai import OpenAI
from app.core.settings.settings import settings


client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=settings.llm_api_key,
)


class QuizAgent:
    def __init__(self, text: str):
        self.text = text
        self.client = client

    def create_quiz(self, num_questions: int = 5, num_alternatives: int = 4):
        prompt = PROMPT_CREATE_QUIZ.format(
            text=self.text,
            num_questions=num_questions,
            num_alternatives=num_alternatives
        )
        
        system_message = "You are QuizLab, an AI agent that creates quizzes from text."
        
        completion = self.client.chat.completions.create(
            model="openai/gpt-oss-20b:together",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2048,
            temperature=0.2,
            top_p=0.95,
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        try:
            parsed_response = json.loads(response_text)
            
            # Validar estrutura básica
            if "perguntas" not in parsed_response:
                raise ValueError("Resposta não contém campo 'perguntas'")
            
            questions = parsed_response["perguntas"]
            
            # Validar número de questões
            if len(questions) != num_questions:
                raise ValueError(f"Esperado {num_questions} questões, mas recebeu {len(questions)}")
            
            # Validar questões únicas
            questions_text = [q.get("pergunta", "").strip().lower() for q in questions]
            if len(questions_text) != len(set(questions_text)):
                raise ValueError("Questões duplicadas detectadas na resposta do LLM")
            
            # Validar número de alternativas por questão
            for i, question in enumerate(questions):
                if "alternativas" not in question:
                    raise ValueError(f"Questão {i+1} não contém alternativas")
                
                alternatives = question["alternativas"]
                if len(alternatives) != num_alternatives:
                    raise ValueError(f"Questão {i+1}: esperado {num_alternatives} alternativas, mas recebeu {len(alternatives)}")
                
                # Verificar se há exatamente uma alternativa correta
                correct_count = sum(1 for alt in alternatives if alt.get("correta", False))
                if correct_count != 1:
                    raise ValueError(f"Questão {i+1}: deve ter exatamente 1 alternativa correta, mas tem {correct_count}")
            
            return parsed_response
        except json.JSONDecodeError:
            raise ValueError(f"Error parsing response: {response_text}")