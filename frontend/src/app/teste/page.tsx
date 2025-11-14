import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/layout/LoadingScreen";

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
                <Input placeholder="oi"/>
            </div>
            <div className="bg-linear-to-r from-qorange-hover to-qblue-default ">oi</div>
            <div className="bg-layout-card h-30">card</div>
            <LoadingScreen />
        </div>
    );
}
