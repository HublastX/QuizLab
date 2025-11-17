import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Pege() {
    return (
        <div>
            Teste page
            <div>
                <Button variant="solid">oi</Button>
                <Button variant="ghost">oi</Button>
                <Button variant="subtle">oi</Button>
                <Button size="lg">oi</Button>
                <Button size="md">oi</Button>
                <Button size="sm">oi</Button>
                <Input placeholder="oi" />
            </div>
            <div className="bg-linear-to-r from-qorange-hover to-qblue-default ">
                oi
            </div>
            <div className="bg-layout-card h-30">card</div>
            <div class="bg-category-create p-4 text-white">
                Create - deve ser laranja
            </div>
            <div class="bg-category-ranking p-4 text-white">
                Ranking - deve ser azul
            </div>
            <div className="bg-category-play p-4 text-black">
                Play - deve ser amarelo
            </div>
        </div>
    );
}
