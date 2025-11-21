"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";

export default function Registro() {
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      const response = await register({ name, email, password });
      console.log("Registro successful:", response);
    } catch (err) {
      console.error("Falha no registro:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black">Registro bem legal</h1>
      
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 mt-5 w-1/2 bg-layout-card p-6"
      >
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="name">Nome</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="password">Senha</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <Button type="submit" disabled={loading} className="mt-4">
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  );
}