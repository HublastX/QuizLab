export interface SubTopic {
  id: string;
  sub_topic: string;
  description: string;
  theme_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTopicRequest {
  sub_topic: string;
  description: string;
  theme_id: string;
}

export interface UseSubTopicReturn {
  subTopics: SubTopic[];
  loading: boolean;
  error: string | null;
  getSubTopicById: (subTopicId: string) => Promise<SubTopic>;
  getSubTopicsByTheme: (themeId: string) => Promise<SubTopic[]>;
  createSubTopic: (data: CreateSubTopicRequest) => Promise<SubTopic>;
  clearError: () => void;
}