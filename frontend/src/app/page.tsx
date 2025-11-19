import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="h-full">
            aqui é uma landipage explicando oq é
            <div>
                <Link href="/registro">
                    <Button>Registro</Button>
                </Link>
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
            </div>

            <section id="quiz">
                <p>aqui vamos resumir o que é o quiz lab</p>
            </section>
            <section id="criar-quiz">
                <p>aqui vamos explicar como funciona a criação de um quiz</p>
            </section>
            <section id="ranking">
                <p>aq nao sei sei vai ter ranking mas se tiver vamos explicalo</p>
            </section>
            <footer>
                footer da landing page
            </footer>
        </div>
    );
}
