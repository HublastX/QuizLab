import AutomaticQuestions from "./automatico/automatico";
import ManualQuestions from "./manual";

export default function Questions() {
    return(
        <div>
            Você gostaria de fazer as próprias questões ou gerar automaticamente?
            <div>Escrever questões manualmente <ManualQuestions /></div>
            <div>Gerar automaticamente <AutomaticQuestions /></div>
        </div>
    )
}