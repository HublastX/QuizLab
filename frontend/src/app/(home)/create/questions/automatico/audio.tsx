export function Audio() {
    return (
        <div>
            <h2>Gerar questões automaticamente a partir de um áudio</h2>

            quantidade de alternartivas por questão
            <input 
                type="number"
            />
            numero de questoes
            <input 
                type="number"
            />
            <input type="file" accept="audio/*" />
        </div>
    );
}