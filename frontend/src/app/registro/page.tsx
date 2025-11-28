"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { 
  BsArrowDown, 
  BsArrowUp, 
  BsArrowReturnLeft 
} from "react-icons/bs";

export default function Registro() {
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ordem dos campos para navegar
  const refs = [nameRef, emailRef, passwordRef, buttonRef];

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

  // ----- NAVEGAÇÃO POR TECLAS -----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = refs.findIndex(r => r.current === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = refs[currentIndex + 1] ?? refs[0];
        next.current?.focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = refs[currentIndex - 1] ?? refs[refs.length - 1];
        prev.current?.focus();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black">Cadastrar-se</h1>

      <p className="mt-2 opacity-70 text-sm">
        Use as setas <strong>↑</strong> e <strong>↓</strong> para navegar entre os campos.
      </p>
      
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 mt-5 w-1/2 bg-layout-card p-6 rounded-lg"
      >
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {/* Nome */}
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="name">Nome</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            ref={nameRef}
            suffix={<BsArrowDown />}
            required
          />
        </div>
        
        {/* Email */}
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            suffix={
              <div className="flex gap-1">
                <BsArrowUp />
                <BsArrowDown />
              </div>
            }
            required
          />
        </div>
        
        {/* Senha */}
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="password">Senha</label>
          <Input
            id="password"
            type="password"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            suffix={<BsArrowUp />}
            required
          />
        </div>
        
        <Button
          ref={buttonRef}
          type="submit"
          disabled={loading}
          className="mt-4 hover:bg-qorange-500"
          suffix={<BsArrowReturnLeft />}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
        
        <div>Já tem uma conta? <a className="text-qyellow-default cursor-pointer underline" href="/quiz-lab/login">Faça login!</a></div>
      </form>
    </div>
  );
}
