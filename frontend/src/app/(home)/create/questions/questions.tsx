import ManualQuestions from "./manual";

export default function Questions() {
    return(
        <div>
            Você gostaria de fazer as próprias questões ou gerar automaticamente?
            <div>Escrever questões <ManualQuestions /></div>
            <div>Gerar automaticamente</div>
        </div>
    )
}