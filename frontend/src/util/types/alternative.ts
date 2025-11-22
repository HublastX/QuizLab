export interface Alternative {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
    question_id: string;
}

export interface CreateAlternativeRequest {
    text: string;
    correct: boolean;
    explanation: string;
}

export interface UpdateAlternativeRequest {
    text?: string;
    correct?: boolean;
    explanation?: string;
}

export interface UseAlternativeReturn {
    loading: boolean;
    error: string | null;
    createAlternative: (
        questionId: string,
        data: CreateAlternativeRequest
    ) => Promise<Alternative>;
    updateAlternative: (
        alternativeId: string,
        data: UpdateAlternativeRequest
    ) => Promise<Alternative>;
    deleteAlternative: (alternativeId: string) => Promise<string>;
    clearError: () => void;
}
