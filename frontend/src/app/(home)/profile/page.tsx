"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaCheck } from "react-icons/fa";
import { FaPencil, FaX } from "react-icons/fa6";

export default function Profile() {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [name, setName] = useState("João Silva");
    const [email, setEmail] = useState("joao@example.com");
    const [tempValue, setTempValue] = useState("");

    const startEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const cancelEdit = () => {
        setEditingField(null);
        setTempValue("");
    };

    const saveEdit = (field: string) => {
        if (field === "name") setName(tempValue);
        if (field === "email") setEmail(tempValue);
        console.log(`Salvando ${field}:`, tempValue);
        setEditingField(null);
        setTempValue("");
    };

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <div className="mb-8">
                <h1 className="text-5xl font-black mb-2">Perfil</h1>
                <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>

            <div className="bg-layout-card rounded-lg shadow-md p-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Nome</label>
                        <div className="flex gap-2 items-center">
                            {editingField === "name" ? (
                                <>
                                    <Input 
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="flex-1"
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => saveEdit("name")}
                                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FaCheck className="size-5" />
                                    </button>
                                    <button 
                                        onClick={cancelEdit}
                                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        <FaX className="size-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1 text-lg p-3 bg-gray-50 rounded-lg border">
                                        {name}
                                    </div>
                                    <button 
                                        onClick={() => startEdit("name", name)}
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <FaPencil className="size-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                        <div className="flex gap-2 items-center">
                            {editingField === "email" ? (
                                <>
                                    <Input 
                                        type="email"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="flex-1"
                                        autoFocus
                                    />
                                    <button 
                                        onClick={() => saveEdit("email")}
                                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FaCheck className="size-5" />
                                    </button>
                                    <button 
                                        onClick={cancelEdit}
                                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        <FaX className="size-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1 text-lg p-3 bg-gray-50 rounded-lg border">
                                        {email}
                                    </div>
                                    <button 
                                        onClick={() => startEdit("email", email)}
                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <FaPencil className="size-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">
                            Cadastrado em: 15 de Novembro de 2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}