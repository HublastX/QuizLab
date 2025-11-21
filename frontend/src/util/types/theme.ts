export interface UseThemeReturn {
  themes: Theme[];
  currentTheme: Theme | null;
  loading: boolean;
  error: string | null;
  
  fetchThemes: () => Promise<void>;
  fetchThemeById: (id: string) => Promise<void>;
  createTheme: (themeData: CreateThemeData) => Promise<Theme>;
  clearError: () => void;
  clearCurrentTheme: () => void;
}

export interface CreateThemeData {
  title: string;
  description: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
