"use client";

import { CiAlarmOn, CiBasketball } from "react-icons/ci";
import HomeCard from "./card";
import Acessibilidade from "./acessibilidade";
import { useUser } from "@/hook/useUser";
//import ThemeList from "./themeList";


export default function Home() {
const { user } = useUser();

    return (
        <div className="flex h-full mt-6 space-x-28">
            <div className="flex-1 h-full flex flex-col gap-9">
                <h1 className="font-bold text-4xl capitalize">
                    Olá, {user?.name || "Visitante"}!
                </h1>
                <div className="grid grid-cols-3 mt-2 gap-6">
                        <HomeCard
                            key= {1}
                            title= "Criar Quiz"
                            icon= {<CiAlarmOn />}
                            description= "Crie seus próprios quizzes personalizados."
                            href= "/create"
                            ariaLabel= "Criar Quiz - Crie seus próprios quizzes personalizados."
                            color = "create"
                        />
                        <HomeCard
                            key= {2}
                            title= "Título 1"
                            icon= {<CiAlarmOn />}
                            description= "Descrição 1"
                            href= "#"
                            ariaLabel= "Título 1 - Descrição 1."
                            color = "create"
                        />
                        <HomeCard
                            key= {3}
                            title= "Título 2"
                            icon= {<CiAlarmOn />}
                            description= "Descrição 2"
                            href= "#"
                            ariaLabel= "Título 2 - Descrição 2."
                            color = "create"
                        />
                        <HomeCard
                            key= {4}
                            title= "Título 3"
                            icon= {<CiAlarmOn />}
                            description= "Descrição 3"
                            href= "#"
                            ariaLabel= "Título 3 - Descrição 3."
                            color = "create"
                        />
                </div>
                <Acessibilidade />
            </div>

            {/* <ThemeList /> */}
        </div>
    );
}
