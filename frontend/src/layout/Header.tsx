import { Button } from "@/components/ui/button";
import { FiFileText, FiPlus, FiUser } from "react-icons/fi";

export default function Header() {
    return (
        <header className="h-16 bg-qorange-default shadow-lg">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md">
                        <FiFileText className="w-6 h-6 text-qorange-default" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        QuizLab
                    </h1>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <a
                        href="/quizzes"
                        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
                    >
                        Quizzes
                    </a>
                    <a
                        href="/create"
                        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
                    >
                        Criar Quiz
                    </a>
                    <a
                        href="/ranking"
                        className="text-white hover:text-qorange-100 transition-colors duration-200 font-medium"
                    >
                        Ranking
                    </a>
                </nav>

                <div className="flex items-center space-x-4">
                    <Button
                        size="sm"
                        className="bg-qyellow-default hover:bg-qyellow-hover text-qyellow-text hidden sm:flex items-center space-x-2 shadow-md font-medium"
                    >
                        <FiPlus className="size-5 text-center" />
                        <span>Novo Quiz</span>
                    </Button>
                    <Button
                        size="sm"
                        className="bg-qblue-default hover:bg-qblue-hover text-qblue-text hidden sm:flex items-center space-x-2 shadow-md font-bold text-xl"
                    >
                        <FiUser className="size-5 text-center" />
                        <span className="hidden sm:inline">Entrar</span>
                    </Button>


                    {/* Menu Mobile */}
                    <button className="md:hidden text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
