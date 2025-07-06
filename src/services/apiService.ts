import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function post<T>(route: string, data: unknown): Promise<T> {
  const response = await apiClient.post<T>(route, data);
  return response.data;
}
