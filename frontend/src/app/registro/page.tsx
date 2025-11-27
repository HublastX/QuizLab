"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/useAuth";
import { Button } from "@/components/ui/button";
import { BsArrowDown, BsArrowLeft, BsArrowReturnLeft, BsArrowUp } from "react-icons/bs";

export default function Registro() {
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Seta para cima - foca no nome
      if (e.key === "ArrowUp") {
        e.preventDefault();
        nameRef.current?.focus();
      }
      // Seta para direita - navega entre campos
      else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (document.activeElement === nameRef.current) {
          emailRef.current?.focus();
        } else if (document.activeElement === emailRef.current) {
          passwordRef.current?.focus();
        } else {
          nameRef.current?.focus();
        }
      }
      // Seta para baixo - navega entre campos
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (document.activeElement === nameRef.current) {
          emailRef.current?.focus();
        } else if (document.activeElement === emailRef.current) {
          passwordRef.current?.focus();
        } else {
          nameRef.current?.focus();
        }
      }
      // Enter - submete o formulário
      else if (e.key === "Enter") {
        e.preventDefault();
        if (!loading) {
          buttonRef.current?.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black">Cadastrar-se</h1>
      
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 mt-5 w-1/2 bg-layout-card p-6 rounded-lg"
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
            ref={nameRef}
            suffix={<BsArrowUp />}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            suffix={<BsArrowDown />}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="password">Senha</label>
          <Input
            id="password"
            type="password"
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            suffix={<BsArrowLeft />}
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