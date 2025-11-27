"use client";

import { CiAlarmOn, CiBasketball, CiBookmarkPlus, CiShare1, CiUser, CiViewList } from "react-icons/ci";
import HomeCard from "./card";
import Acessibilidade from "./acessibilidade";
import { useUser } from "@/hook/useUser";
import { useEffect } from "react";
// import ThemeList from "./themeList";


export default function Home() {
const { user, getMe } = useUser();
  useEffect(() => {
    getMe();
  }, []);

    return (
        <div className="flex h-full mt-6 space-x-24">
            <div className="flex-1 h-full flex flex-col gap-9">
            {/* <div className="flex-1 h-full flex flex-col gap-9 max-w-2/3"> */}
                <h1 className="font-bold text-4xl capitalize">
                    Olá, {user?.name || "Visitante"}!
                </h1>
                <div className="grid grid-cols-3 mt-2 gap-6">
                        <HomeCard
                            key= {1}
                            title= "Criar Quiz"
                            icon= {<CiBookmarkPlus />}
                            description= "Crie seus próprios quizzes personalizados."
                            href= "/create"
                            ariaLabel= "Criar Quiz - Crie seus próprios quizzes personalizados."
                            color= "create"
                            cornerIcon={<CiShare1 />}
                        />
                        <HomeCard
                            key= {3}
                            title= "Ver Quizzes"
                            icon= {<CiViewList />}
                            description= "Veja sua lista de quizzes."
                            href= "/play"
                            color= "play"
                            />
                        <HomeCard
                            key= {4}
                            title= "Perfil"
                            icon= {<CiUser />}
                            description= "Acesse e edite seu perfil."
                            href= "/profile"
                            color= "ranking"
                        />
                </div>
                <Acessibilidade />
            </div>

            {/* <ThemeList /> */}
        </div>
    );
}
