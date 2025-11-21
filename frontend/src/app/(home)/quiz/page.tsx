"use client";

import { useQuiz } from "@/hook/useQuiz";
import { useState } from "react";

export default function QuizTextTest() {
    const { quizText, loading, error, data } = useQuiz();
    const [formData, setFormData] = useState({
        text: "",
        theme_id: "",
        sub_topic_id: "",
        num_questions: "5",
        num_alternatives: "4",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const params = {
                text: formData.text,
                theme_id: formData.theme_id,
                sub_topic_id: formData.sub_topic_id,
                num_questions: formData.num_questions
                    ? parseInt(formData.num_questions)
                    : undefined,
                num_alternatives: formData.num_alternatives
                    ? parseInt(formData.num_alternatives)
                    : undefined,
            };

            await quizText(params);
        } catch (err) {
            // Erro já é tratado no hook
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        maxWidth: "400px",
                    }}
                >
                    <input
                        type="text"
                        name="text"
                        id="text"
                        value={formData.text}
                        onChange={handleChange}
                        placeholder="Texto *"
                        required
                    />
                    <input
                        type="text"
                        name="theme_id"
                        id="theme_id"
                        value={formData.theme_id}
                        onChange={handleChange}
                        placeholder="ID do Tema *"
                        required
                    />
                    <input
                        type="text"
                        name="sub_topic_id"
                        id="sub_topic_id"
                        value={formData.sub_topic_id}
                        onChange={handleChange}
                        placeholder="ID do Subtópico *"
                        required
                    />
                    <input
                        type="number"
                        name="num_questions"
                        id="num_quest"
                        value={formData.num_questions}
                        onChange={handleChange}
                        placeholder="Número de Questões"
                        min="1"
                        max="20"
                    />
                    <input
                        type="number"
                        name="num_alternatives"
                        id="num_alt"
                        value={formData.num_alternatives}
                        onChange={handleChange}
                        placeholder="Número de Alternativas"
                        min="2"
                        max="5"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: "10px", marginTop: "10px" }}
                    >
                        {loading ? "Gerando..." : "Gerar Quiz"}
                    </button>
                </form>
            </div>

            {error && (
                <p style={{ color: "red", marginTop: "20px" }}>Erro: {error}</p>
            )}

            {data && (
                <div style={{ marginTop: "30px" }}>
                    <h3>Quiz Gerado:</h3>
                    {data.perguntas.map((pergunta, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                margin: "10px 0",
                                borderRadius: "5px",
                            }}
                        >
                            <h4>
                                Pergunta {index + 1}: {pergunta.pergunta}
                            </h4>
                            <div>
                                {pergunta.alternativas.map((alt, altIndex) => (
                                    <div
                                        key={altIndex}
                                        style={{
                                            padding: "8px",
                                            margin: "5px 0",
                                            backgroundColor: alt.correta
                                                ? "#e8f5e8"
                                                : "#f5f5f5",
                                            border: alt.correta
                                                ? "2px solid #4caf50"
                                                : "1px solid #ddd",
                                        }}
                                    >
                                        <strong>{alt.letra}</strong>.{" "}
                                        {alt.texto}
                                        {alt.correta && (
                                            <span
                                                style={{
                                                    color: "#4caf50",
                                                    marginLeft: "10px",
                                                }}
                                            >
                                                ✓ Correta
                                            </span>
                                        )}
                                        {alt.explicacao && (
                                            <div
                                                style={{
                                                    fontSize: "0.9em",
                                                    color: "#666",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                Explicação: {alt.explicacao}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
