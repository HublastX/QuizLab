import { Documento } from "./documento";
import { Texto } from "./texto";

export default function AutomaticQuestions() {
    return (
        <div>
            <Texto />
            <Documento />
            <div>gerar por audio</div>
        </div>
    );
}
