import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManualQuestions() {
    return(
        <div className="space-y-6">
            nome da questão
            <input type="text" />
            <div className="border border-gray-200 p-6 rounded-xl space-y-4 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Alternativa:</label>
                    <Input 
                        placeholder="Escreva sua Alternativa" 
                        className="border-gray-300 focus:border-gray-400"
                    />
                </div>
                
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Está correta?</label>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Explicação:</label>
                    <Input 
                        placeholder="Explique a resposta" 
                        className="border-gray-300 focus:border-gray-400"
                    />
                </div>
            </div>

            <div className="border border-gray-200 p-6 rounded-xl space-y-4 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Alternativa:</label>
                    <Input 
                        placeholder="Escreva sua Alternativa" 
                        className="border-gray-300 focus:border-gray-400"
                    />
                </div>
                
                <div className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Está correta?</label>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Explicação:</label>
                    <Input 
                        placeholder="Explique a resposta" 
                        className="border-gray-300 focus:border-gray-400"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                    className="border-gray-300 hover:bg-gray-50"
                >
                    + Adicionar Alternativa
                </Button>
            </div>
        </div>
    )
}