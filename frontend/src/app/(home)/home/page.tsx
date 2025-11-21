"use client";

import { CiAlarmOn, CiBasketball } from "react-icons/ci";
import HomeCard from "./card";
import Acessibilidade from "./acessibilidade";
//import ThemeList from "./themeList";
import cards from "./cards.json";


export default function Home() {

    return (
        <div className="flex h-full mt-6 space-x-28">
            <div className="flex-1 h-full flex flex-col gap-9">
                <h1 className="font-bold text-4xl capitalize">
                    Olá,
                </h1>
                <div className="grid grid-cols-3 mt-2 gap-6">
                    {cards.card.map((card, index) => (
                        <HomeCard
                            key={index}
                            title={card.title}
                            icon={card.icon}
                            description={card.description}
                            href={card.href}
                            ariaLabel={card.ariaLabel}
                            color = {card.color}
                        />))}
                </div>
                <Acessibilidade />
            </div>

            {/* <ThemeList /> */}
        </div>
    );
}
