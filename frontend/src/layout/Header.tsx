// layout/Header.tsx
"use client";
import { Button } from "@/components/ui/button";
import { FiFileText, FiPlus, FiUser, FiLogOut, FiPlay, FiAward } from "react-icons/fi";
import { useHeader } from "@/context/HeaderContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { variant, userName } = useHeader();
  const router = useRouter();


  // NAV PARA VARIANT DEFAULT (público)
  const renderDefaultNav = () => (
    <nav className="hidden md:flex items-center space-x-6">
      <a
        href="#quiz"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
      >
        Quizzes
      </a>
      <a
        href="#criar-quiz"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
      >
        Criar Quiz
      </a>
      <a
        href="#ranking"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
      >
        Ranking
      </a>
    </nav>
  );

  // NAV PARA VARIANT DASHBOARD (logado)
  const renderDashboardNav = () => (
    <nav className="hidden md:flex items-center space-x-6">
      <a
        href="/home/create"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium flex items-center space-x-1"
      >
        <FiPlus className="w-4 h-4" />
        <span>Criar Quiz</span>
      </a>
      <a
        href="/home/play"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium flex items-center space-x-1"
      >
        <FiPlay className="w-4 h-4" />
        <span>Jogar</span>
      </a>
      <a
        href="/home/profile"
        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium flex items-center space-x-1"
      >
        <FiUser className="w-4 h-4" />
        <span>Perfil</span>
      </a>
    </nav>
  );

  // BOTÕES PARA VARIANT DEFAULT (público)
  const renderAuthButtons = () => (
    <div className="flex items-center space-x-4">
      <Button 
        className="text-white border-white hover:bg-white hover:text-qorange-default"
        onClick={() => router.push("/login")}
      >
        Login
      </Button>
      <Button 
        className="bg-white text-qorange-default hover:bg-qorange-700 hover:text-white"
        onClick={() => router.push("/registro")}
      >
        Cadastrar
      </Button>
    </div>
  );


  return (
    <header className="h-16 bg-qorange-default shadow-lg">
      <div className="h-full px-6 flex items-center justify-between">
        {/* LOGO */}
        {variant !== "dashboard" ? <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md">
            <FiFileText className="w-6 h-6 text-qorange-default" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            QuizLab
          </h1> </div> :         <Link href="/home" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md">
            <FiFileText className="w-6 h-6 text-qorange-default" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            QuizLab
          </h1>
        </Link>}


        {/* NAVEGAÇÃO CONDICIONAL */}
        {variant === "dashboard" ? renderDashboardNav() : renderDefaultNav()}

        {/* BOTÕES CONDICIONAIS */}
        <div className="flex items-center space-x-4">
          {variant !== "dashboard" && renderAuthButtons()}
        </div>
      </div>
    </header>
  );
}