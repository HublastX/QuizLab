export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  getMe: () => Promise<User>;
  clearError: () => void;
}