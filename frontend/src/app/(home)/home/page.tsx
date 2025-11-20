"use client";

import { CiAlarmOn, CiBasketball } from "react-icons/ci";
import HomeCard from "./card";
import Acessibilidade from "./acessibilidade";
import { useAuth } from "@/hook/useAuth";
import ThemeList from "./themeList";

export default function Home() {
    const { user } = useAuth();
    // const cards = [
    //     {
    //         title: "Criar Quiz",
    //         icon: <CiAlarmOn />,
    //         description: "Crie seus próprios quizzes personalizados.",
    //         href: "/create",
    //         ariaLabel: "Criar Quiz - Crie seus próprios quizzes personalizados.",
    //         color: "create",
    //     },

    // ];

    return (
        <div className="flex h-full mt-6 space-x-28">
            <div className="flex-1 h-full flex flex-col gap-9">
                <h1 className="font-bold text-4xl capitalize">
                    Olá, {user?.name}!
                </h1>
                <div className="grid grid-cols-3 mt-2 gap-6">
                    {/* {cards.map((card, index) => (
                        <HomeCard
                            key={index}
                            title={card.title}
                            icon={card.icon}
                            description={card.description}
                            href={card.href}
                            ariaLabel={card.ariaLabel}
                            color={card.color}
                        />
                    ))} */}
                </div>
                <Acessibilidade />
            </div>

            <ThemeList />
        </div>
    );
}
