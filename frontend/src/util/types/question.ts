export interface Alternative {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  text: string;
  sub_topic_id: string;
  created_at: string;
  updated_at: string;
  alternatives: Alternative[];
}

export interface CreateQuestionRequest {
  text: string;
  sub_topic_id: string;
  alternatives: Alternative[];
}

export interface UpdateQuestionRequest {
  text?: string;
  sub_topic_id?: string;
}

export interface QuestionsResponse {
  questions: Question[];
}

export interface UseQuestionReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  getQuestionById: (questionId: string) => Promise<Question>;
  getQuestionsBySubTopic: (subTopicId: string) => Promise<Question[]>;
  createQuestion: (data: CreateQuestionRequest) => Promise<Question>;
  updateQuestion: (questionId: string, data: UpdateQuestionRequest) => Promise<Question>;
  deleteQuestion: (questionId: string) => Promise<string>;
  clearError: () => void;
}