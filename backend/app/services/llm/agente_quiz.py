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
            return json.loads(response_text)
        except json.JSONDecodeError:
            raise ValueError(f"Error parsing response: {response_text}")