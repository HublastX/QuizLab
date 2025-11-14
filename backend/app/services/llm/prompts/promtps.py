PROMPT_CRAETE_QUIZ = """Analise o seguinte texto e crie exatamente {numero_perguntas} perguntas de múltipla escolha sobre o conteúdo e exatamente {numero_alternativas} alternativas para cada pergunta.

    TEXTO:
    {texto}

    INSTRUÇÕES:
    1. Crie {numero_perguntas} perguntas baseadas no texto acima.
    2. Crie {numero_alternativas} alternativas para cada pergunta.
    3. Cada pergunta deve ter exatamente {numero_alternativas} alternativas.
    4. Apenas uma alternativa deve estar correta para cada pergunta.
    5. Indique qual alternativa é a correta para cada pergunta.
    6. Para cada alternativa, inclua um campo "explicacao" que explique brevemente:
       - Para a alternativa correta: por que ela está correta
       - Para as alternativas incorretas: por que estão incorretas
    7. Retorne os dados em formato JSON exatamente como no exemplo a seguir, sem texto adicional:

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

    Importante: As explicações devem ser concisas (curta) e baseadas nas informações do texto. Para alternativas corretas, explique por que estão certas; para incorretas, explique por que estão erradas seja curto mas detalhado ter uma boa explicação.

    """