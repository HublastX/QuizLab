"use client";

import { useTopics } from "@/app/hook/useTopics";
import { useState, useEffect } from "react";

export default function SubTopicPageTest() {
    const {
        postSubTopic,
        getSubTopicById,
        getSubTopicsByThemeId,
        loading,
        error,
    } = useTopics();
    const [subTopicData, setSubTopicData] = useState({
        sub_topic: "",
        description: "",
        theme_id: "",
    });
    const [subTopicId, setSubTopicId] = useState("");
    const [themeIdForSearch, setThemeIdForSearch] = useState("");
    const [createdSubTopic, setCreatedSubTopic] = useState<any>(null);
    const [specificSubTopic, setSpecificSubTopic] = useState<any>(null);
    const [subTopicsByTheme, setSubTopicsByTheme] = useState<any[]>([]);

    // Criar novo subtópico
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !subTopicData.sub_topic.trim() ||
            !subTopicData.description.trim() ||
            !subTopicData.theme_id.trim()
        ) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const result = await postSubTopic(subTopicData);
            setCreatedSubTopic(result);
            setSubTopicData({ sub_topic: "", description: "", theme_id: "" });
        } catch (err) {
            console.error("Erro ao criar subtópico:", err);
        }
    };

    // Buscar subtópico por ID
    const handleGetSubTopicById = async () => {
        if (!subTopicId.trim()) {
            alert("Digite um ID de subtópico");
            return;
        }

        try {
            const result = await getSubTopicById(subTopicId);
            setSpecificSubTopic(result);
        } catch (err) {
            console.error("Erro ao buscar subtópico:", err);
            setSpecificSubTopic(null);
        }
    };

    // Buscar subtópicos por theme_id
    const handleGetSubTopicsByTheme = async () => {
        if (!themeIdForSearch.trim()) {
            alert("Digite um ID de tema");
            return;
        }

        try {
            const result = await getSubTopicsByThemeId(themeIdForSearch);
            setSubTopicsByTheme(result);
        } catch (err) {
            console.error("Erro ao buscar subtópicos do tema:", err);
            setSubTopicsByTheme([]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setSubTopicData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubTopicIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubTopicId(e.target.value);
    };

    const handleThemeIdForSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setThemeIdForSearch(e.target.value);
    };

    return (
        <div>
            <h1>Gerenciamento de Subtópicos</h1>

            {/* Seção: Criar Novo Subtópico */}
            <section>
                <h2>Criar Novo Subtópico</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            id="sub_topic"
                            name="sub_topic"
                            value={subTopicData.sub_topic}
                            onChange={handleChange}
                            placeholder="Digite o subtópico"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <textarea
                            id="description"
                            name="description"
                            value={subTopicData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Digite a descrição do subtópico"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            id="theme_id"
                            name="theme_id"
                            value={subTopicData.theme_id}
                            onChange={handleChange}
                            placeholder="Digite o ID do tema"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Criando..." : "Criar Subtópico"}
                    </button>
                </form>
            </section>

            {/* Seção: Buscar Subtópico por ID */}
            <section>
                <h2>Buscar Subtópico por ID</h2>

                <div>
                    <input
                        type="text"
                        value={subTopicId}
                        onChange={handleSubTopicIdChange}
                        placeholder="Digite o ID do subtópico"
                        disabled={loading}
                    />
                    <button onClick={handleGetSubTopicById} disabled={loading}>
                        {loading ? "Buscando..." : "Buscar Subtópico"}
                    </button>
                </div>

                {specificSubTopic && (
                    <div>
                        <h3>Subtópico Encontrado:</h3>
                        <div>
                            <p>
                                <strong>ID:</strong> {specificSubTopic.id}
                            </p>
                            <p>
                                <strong>Subtopico:</strong>{" "}
                                {specificSubTopic.sub_topic}
                            </p>
                            <p>
                                <strong>Descrição:</strong>{" "}
                                {specificSubTopic.description}
                            </p>
                            <p>
                                <strong>Theme ID:</strong>{" "}
                                {specificSubTopic.theme_id}
                            </p>
                            <p>
                                <strong>Criado em:</strong>{" "}
                                {new Date(
                                    specificSubTopic.created_at
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Seção: Buscar Subtópicos por Theme ID */}
            <section>
                <h2>Buscar Subtópicos por Theme ID</h2>

                <div>
                    <input
                        type="text"
                        value={themeIdForSearch}
                        onChange={handleThemeIdForSearchChange}
                        placeholder="Digite o ID do tema"
                        disabled={loading}
                    />
                    <button
                        onClick={handleGetSubTopicsByTheme}
                        disabled={loading}
                    >
                        {loading ? "Buscando..." : "Buscar Subtópicos"}
                    </button>
                </div>

                {subTopicsByTheme.length > 0 ? (
                    <div>
                        <h3>Subtopicos do Tema {themeIdForSearch}:</h3>
                        {subTopicsByTheme.map((subTopic) => (
                            <div key={subTopic.id}>
                                <p>
                                    <strong>ID:</strong> {subTopic.id}
                                </p>
                                <p>
                                    <strong>Subtopico:</strong>{" "}
                                    {subTopic.sub_topic}
                                </p>
                                <p>
                                    <strong>Descrição:</strong>{" "}
                                    {subTopic.description}
                                </p>
                                <p>
                                    <strong>Theme ID:</strong>{" "}
                                    {subTopic.theme_id}
                                </p>
                                <p>
                                    <strong>Criado em:</strong>{" "}
                                    {new Date(
                                        subTopic.created_at
                                    ).toLocaleString()}
                                </p>
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum subtópico encontrado para este tema</p>
                )}
            </section>

            {/* Seção: Subtópico Criado com Sucesso */}
            {createdSubTopic && (
                <section>
                    <h2>Subtopico criado com sucesso!</h2>
                    <div>
                        <p>
                            <strong>ID:</strong> {createdSubTopic.id}
                        </p>
                        <p>
                            <strong>Subtopico:</strong>{" "}
                            {createdSubTopic.sub_topic}
                        </p>
                        <p>
                            <strong>Descrição:</strong>{" "}
                            {createdSubTopic.description}
                        </p>
                        <p>
                            <strong>Theme ID:</strong>{" "}
                            {createdSubTopic.theme_id}
                        </p>
                        <p>
                            <strong>Criado em:</strong>{" "}
                            {new Date(
                                createdSubTopic.created_at
                            ).toLocaleString()}
                        </p>
                    </div>
                </section>
            )}

            {/* Seção: Erro */}
            {error && (
                <div>
                    <h2>Erro</h2>
                    <p>Erro: {error}</p>
                </div>
            )}
        </div>
    );
}
