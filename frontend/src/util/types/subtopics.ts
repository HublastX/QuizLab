export interface SubTopic {
  id: string;
  sub_topic: string;
  description: string;
  theme_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTopicData {
  sub_topic: string;
  description: string;
  theme_id: string;
}

export interface UseSubTopicReturn {
  subTopics: SubTopic[];
  currentSubTopic: SubTopic | null;
  loading: boolean;
  error: string | null;
  
  fetchSubTopicsByTheme: (themeId: string) => Promise<void>;
  fetchSubTopicById: (id: string) => Promise<void>;
  createSubTopic: (subTopicData: CreateSubTopicData) => Promise<SubTopic>;
  clearError: () => void;
  clearCurrentSubTopic: () => void;
}