"use client";

import { CiBookmarkPlus, CiUser, CiViewList } from "react-icons/ci";
import {
    BsArrowUp,
    BsArrowDown,
    BsArrowLeft,
    BsArrowRight,
} from "react-icons/bs";
import HomeCard from "./card";
import Acessibilidade from "./acessibilidade";
import { useUser } from "@/hook/useUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { user, getMe } = useUser();
    const router = useRouter();

    useEffect(() => {
        getMe();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    router.push("/create"); // Navega para Criar Quiz
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    router.push("/play"); // Navega para Ver Quizzes
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    router.push("/profile"); // Navega para Perfil
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [router]);

    return (
        <div className="flex h-full mt-4 md:mt-6 space-x-0 md:space-x-6 lg:space-x-24">
            <div className="flex-1 h-full flex flex-col gap-6 md:gap-9 w-full">
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl capitalize">
                    Olá, {user?.name || "Visitante"}!
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 gap-4 md:gap-6">
                    <HomeCard
                        key={1}
                        title="Criar Quiz"
                        icon={<CiBookmarkPlus />}
                        description="Crie seus próprios quizzes personalizados."
                        href="/create"
                        ariaLabel="Criar Quiz - Crie seus próprios quizzes personalizados."
                        color="create"
                        cornerIcon={<BsArrowUp />}
                    />
                    <HomeCard
                        key={3}
                        title="Ver Quizzes"
                        icon={<CiViewList />}
                        description="Veja sua lista de quizzes."
                        href="/play"
                        color="play"
                        cornerIcon={<BsArrowDown />}
                    />
                    <HomeCard
                        key={4}
                        title="Perfil"
                        icon={<CiUser />}
                        description="Acesse e edite seu perfil."
                        href="/profile"
                        color="ranking"
                        cornerIcon={<BsArrowRight />}
                    />
                </div>
                <Acessibilidade />
            </div>
        </div>
    );
}
