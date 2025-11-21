import { CreateSubTopicData, SubTopic, UseSubTopicReturn } from '@/util/types/subtopics';
import { useState, useEffect } from 'react';



export const useSubTopic = (): UseSubTopicReturn => {
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [currentSubTopic, setCurrentSubTopic] = useState<SubTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAccessToken();
    
    if (!token) {
      throw new Error('Token de acesso não encontrado');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }

    return response;
  };

  const fetchSubTopicsByTheme = async (themeId: string): Promise<void> => {
    if (!themeId) {
      setError('ID do tema não fornecido');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(`/api/subtopic/theme/${themeId}`);
      const data = await response.json();
      setSubTopics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar subtópicos';
      setError(errorMessage);
      setSubTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubTopicById = async (id: string): Promise<void> => {
    if (!id) {
      setError('ID do subtópico não fornecido');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(`/api/subtopic/${id}`);
      const data = await response.json();
      setCurrentSubTopic(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar subtópico';
      setError(errorMessage);
      setCurrentSubTopic(null);
    } finally {
      setLoading(false);
    }
  };

  const createSubTopic = async (subTopicData: CreateSubTopicData): Promise<SubTopic> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth('/api/subtopic', {
        method: 'POST',
        body: JSON.stringify(subTopicData),
      });
      
      const newSubTopic = await response.json();
      
      if (newSubTopic.theme_id) {
        setSubTopics(prev => [...prev, newSubTopic]);
      }
      
      setCurrentSubTopic(newSubTopic);
      
      return newSubTopic;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar subtópico';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const clearCurrentSubTopic = (): void => {
    setCurrentSubTopic(null);
  };

  return {
    subTopics,
    currentSubTopic,
    loading,
    error,
    fetchSubTopicsByTheme,
    fetchSubTopicById,
    createSubTopic,
    clearError,
    clearCurrentSubTopic,
  };
};

export const useSubTopicsByTheme = (themeId?: string) => {
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  useEffect(() => {
    if (!themeId) return;

    const fetchSubTopics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getAccessToken();
        
        if (!token) {
          throw new Error('Token de acesso não encontrado');
        }

        const response = await fetch(`/api/subtopic/theme/${themeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
          throw new Error(errorData.error || `Erro ${response.status}`);
        }

        const subTopicsData = await response.json();
        setSubTopics(subTopicsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar subtópicos';
        setError(errorMessage);
        setSubTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubTopics();
  }, [themeId]);

  return { subTopics, loading, error };
};

export const useSubTopicById = (subTopicId?: string) => {
  const [subTopic, setSubTopic] = useState<SubTopic | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = (): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || '';
    }
    return '';
  };

  useEffect(() => {
    if (!subTopicId) return;

    const fetchSubTopic = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getAccessToken();
        
        if (!token) {
          throw new Error('Token de acesso não encontrado');
        }

        const response = await fetch(`/api/subtopic/${subTopicId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
          throw new Error(errorData.error || `Erro ${response.status}`);
        }

        const subTopicData = await response.json();
        setSubTopic(subTopicData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar subtópico';
        setError(errorMessage);
        setSubTopic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubTopic();
  }, [subTopicId]);

  return { subTopic, loading, error };
};