export interface Theme {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateThemeRequest {
  title: string;
  description: string;
}

export interface UpdateThemeRequest {
  title?: string;
  description?: string;
}

export interface UseThemeReturn {
  themes: Theme[];
  loading: boolean;
  error: string | null;
  getThemes: () => Promise<Theme[]>;
  getThemeById: (themeId: string) => Promise<Theme>;
  createTheme: (data: CreateThemeRequest) => Promise<Theme>;
  updateTheme: (themeId: string, data: UpdateThemeRequest) => Promise<Theme>;
  deleteTheme: (themeId: string) => Promise<string>;
  clearError: () => void;
}