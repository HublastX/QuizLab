export interface QuizAlternativa {
    letra: string;
    texto: string;
    correta: boolean;
    explicacao: string;
}

export interface QuizPergunta {
    pergunta: string;
    alternativas: QuizAlternativa[];
    theme_id: string;
    sub_topic_id: string;
}

export interface QuizResponse {
    perguntas: QuizPergunta[];
}

export interface CreateQuizTextRequest {
    text: string;
    theme_id: string;
    sub_topic_id: string;
    num_questions?: number;
    num_alternatives?: number;
}

export interface CreateQuizFileRequest {
    file: File;
    theme_id: string;
    sub_topic_id: string;
    num_questions?: number;
    num_alternatives?: number;
}

export interface UseQuizReturn {
    loading: boolean;
    error: string | null;
    createQuizFromText: (data: CreateQuizTextRequest) => Promise<QuizResponse>;
    createQuizFromDocument: (
        data: CreateQuizFileRequest
    ) => Promise<QuizResponse>;
    createQuizFromAudio: (data: CreateQuizFileRequest) => Promise<QuizResponse>;
    clearError: () => void;
}
