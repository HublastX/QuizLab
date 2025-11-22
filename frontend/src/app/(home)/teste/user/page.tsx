"use client";

import { useEffect } from "react";
import { useUser } from "@/hook/useUser";

export default function ProfilePage() {
  const { user, loading, error, getMe } = useUser();

  useEffect(() => {
    getMe();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!user) return <p>Usuário não encontrado</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Criado em: {new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );
}