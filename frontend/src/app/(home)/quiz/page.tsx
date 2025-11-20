'use client';
import { useState } from "react";
import { useQuiz } from "@/hook/useQuiz";

export default function QuizTextTest() {
    const { quizText, loading, error } = useQuiz();
    const [formData, setFormData] = useState({
        text: "",
        themeid: "",
        subtopicid: "",
        num_quest: "",
        num_alt: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        await quizText(formData);
    };

    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="text" 
                        id="text" 
                        value={formData.text} 
                        onChange={handleChange}
                        placeholder="Texto"
                    />
                    <input 
                        type="text" 
                        name="themeid" 
                        id="themeid" 
                        value={formData.themeid}
                        onChange={handleChange}
                        placeholder="ID do Tema"
                    />
                    <input 
                        type="text" 
                        name="subtopicid" 
                        id="subtopicid" 
                        value={formData.subtopicid}
                        onChange={handleChange}
                        placeholder="ID do Subtópico"
                    />
                    <input 
                        type="text" 
                        name="num_quest" 
                        id="num_quest" 
                        value={formData.num_quest}
                        onChange={handleChange}
                        placeholder="Número de Questões"
                    />
                    <input 
                        type="text" 
                        name="num_alt" 
                        id="num_alt" 
                        value={formData.num_alt}
                        onChange={handleChange}
                        placeholder="Número de Alternativas"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Gerando..." : "Gerar Quiz"}
                    </button>
                </form>
            </div>
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        </div>
    )
}