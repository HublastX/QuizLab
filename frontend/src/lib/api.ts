export function getBackendUrl(): string {
  if (typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (url && url.includes('quizlab')) {
      return url.replace('quizlab', 'localhost');
    }
    return url || 'http://localhost:9080';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://quizlab:9080';
}

export function getApiUrl(path: string): string {
  const baseUrl = getBackendUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}