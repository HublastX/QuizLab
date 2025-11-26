interface DocumentoProps {
    onBack: () => void;
}

export function Documento({ onBack }: DocumentoProps) {
    return (
        <div>
            <h2>Gerar questões automaticamente a partir de um documento</h2>

            quantidade de alternartivas por questão
            <input 
                type="number"
            />
            numero de questoes
            <input 
                type="number"
            />
            <input type="file" />
        </div>
    );
}