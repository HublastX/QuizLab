PROMPT_CREATE_QUIZ = """Analise o seguinte texto e crie exatamente {num_questions} perguntas de múltipla escolha sobre o conteúdo e exatamente {num_alternatives} alternativas para cada pergunta.

    TEXTO:
    {text}

    INSTRUÇÕES CRÍTICAS:
    1. Crie EXATAMENTE {num_questions} perguntas ÚNICAS e DIFERENTES baseadas no texto acima.
    2. Crie EXATAMENTE {num_alternatives} alternativas para cada pergunta.
    3. Cada pergunta deve ter exatamente {num_alternatives} alternativas.
    4. Apenas uma alternativa deve estar correta para cada pergunta.
    5. NUNCA repita perguntas - cada pergunta deve ser única e abordar aspectos diferentes do texto.
    6. NUNCA duplique o conteúdo - retorne apenas uma vez cada pergunta.
    7. Indique qual alternativa é a correta para cada pergunta.
    8. Para cada alternativa, inclua um campo "explicacao" que explique brevemente:
       - Para a alternativa correta: por que ela está correta
       - Para as alternativas incorretas: por que estão incorretas
    9. Retorne os dados em formato JSON exatamente como no exemplo a seguir, sem texto adicional:

    ```json
    {{
    "perguntas": [
        {{
        "pergunta": "Texto da pergunta 1?",
        "alternativas": [
            {{
                "letra": "A",
                "texto": "Alternativa A",
                "correta": false,
                "explicacao": "Esta alternativa está incorreta porque contradiz o conceito X mencionado no texto."
            }},
            {{
                "letra": "B",
                "texto": "Alternativa B",
                "correta": true,
                "explicacao": "Esta alternativa está correta porque corresponde exatamente ao conceito explicado no parágrafo Y do texto."
            }},
            {{
                "letra": "C",
                "texto": "Alternativa C",
                "correta": false,
                "explicacao": "Esta alternativa está incorreta porque confunde o conceito Z com W."
            }},
            {{
                "letra": "D",
                "texto": "Alternativa D",
                "correta": false,
                "explicacao": "Esta alternativa está incorreta porque apresenta uma informação que não consta no texto."
            }}
        ]
        }},
        ...
    ]
    }}
    ```

    IMPORTANTE: 
    - As explicações devem ser concisas e baseadas nas informações do texto
    - Para alternativas corretas, explique por que estão certas
    - Para incorretas, explique por que estão erradas
    - RETORNE EXATAMENTE {num_questions} perguntas, nem mais nem menos
    - NUNCA duplique perguntas ou conteúdo
    - Cada pergunta deve ser única e diferente das outras

    """