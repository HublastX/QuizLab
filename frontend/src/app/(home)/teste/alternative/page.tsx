"use client";

import { useAlternative } from "@/hook/useAlternative";

export default function AlternativesManager({
    questionId,
}: {
    questionId: string;
}) {
    const {
        loading,
        error,
        createAlternative,
        updateAlternative,
        deleteAlternative,
    } = useAlternative();

    const handleCreate = async () => {
        await createAlternative(questionId, {
            text: "Nova alternativa",
            correct: false,
            explanation: "Explicação da alternativa",
        });
    };

    const handleUpdate = async (alternativeId: string) => {
        await updateAlternative(alternativeId, {
            text: "Texto atualizado",
            correct: true,
            explanation: "Nova explicação",
        });
    };

    const handleDelete = async (alternativeId: string) => {
        await deleteAlternative(alternativeId);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div>
            <button onClick={handleCreate}>Adicionar Alternativa</button>
            {/* Renderizar alternativas aqui */}
        </div>
    );
}
