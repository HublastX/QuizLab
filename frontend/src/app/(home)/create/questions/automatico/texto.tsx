export function Texto() {
    return (
        <div>
            <h2>Gerar questões automaticamente a partir de um texto</h2>

            quantidade de alternartivas por questão
            <input 
                type="number"
            />
            numero de questoes
            <input 
                type="number"
            />
            <textarea
                name="automaticQuestionsText"
                id="automaticQuestionsText"
                className="w-full h-48 border  rounded-md p-2"
                placeholder="Insira o texto aqui..."
            ></textarea>
        </div>
    );
}