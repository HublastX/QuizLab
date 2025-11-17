import { CiAlarmOn, CiBasketball } from "react-icons/ci";
import HomeCard from "./card";

export default function Home() {
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
        <div className="grid grid-cols-2 space-x-9 h-full mt-6">
            <div className="h-full flex flex-col gap-14">
                <h1 className="font-bold text-4xl">Olá, Seu Nome!</h1>
                <div className="grid grid-cols-3 mt-3 gap-6">
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

                    <HomeCard
                        title="Título 1"
                        icon={<CiAlarmOn />}
                        description="Descrição 1"
                        href="#"
                        ariaLabel="Título 1 - Descrição 1"
                        color="create"
                    />
                    <HomeCard
                        title="Título 2"
                        icon={<CiAlarmOn />}
                        description="Descrição 2"
                        href="#"
                        ariaLabel="Título 2 - Descrição 2"
                        color="ranking"
                    />
                    <HomeCard
                        title="Título 3"
                        icon={<CiAlarmOn />}
                        description="Descrição 3"
                        href="#"
                        ariaLabel="Título 3 - Descrição 3"
                        color="play"
                    />
                    <HomeCard
                        title="Título 3"
                        icon={<CiAlarmOn />}
                        description="Descrição 3"
                        href="#"
                        ariaLabel="Título 3 - Descrição 3"
                        color="create"
                    />
                    <HomeCard
                        title="Título 3"
                        icon={<CiAlarmOn />}
                        description="Descrição 3"
                        href="#"
                        ariaLabel="Título 3 - Descrição 3"
                        color="ranking"
                    />
                    <HomeCard
                        title="Título 3"
                        icon={<CiAlarmOn />}
                        description="Descrição 3"
                        href="#"
                        ariaLabel="Título 3 - Descrição 3"
                        color="play"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 gap-6">
                    <h2 className="text-2xl font-black">Tema</h2>
                    <div className="grid grid-cols-3 gap-3 overflow-auto">
                        <HomeCard
                            title="pitagoras"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="playstation"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="Arvore"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="luva de pedreiro"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="luva de pedreiro"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="luva de pedreiro"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                        <HomeCard
                            title="luva de pedreiro"
                            icon={<CiBasketball />}
                            description="Descrição 3"
                            href="#"
                            ariaLabel="Título 3 - Descrição 3"
                            color="play"
                            variant="theme"
                        />
                    </div>
                </div>
                <div className="bg-layout-card p-4 rounded-lg shadow-md">
                    Configurações de acessibilidade
                </div>
            </div>
        </div>
    );
}
