import axios from 'axios';
import { store } from '@/store/store';

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function post<T>(route: string, data: unknown): Promise<T> {
  const response = await apiClient.post<T>(route, data);
  return response.data;
}
