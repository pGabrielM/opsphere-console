import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3003',
})

export const useApi = () => ({
  validateToken: async (token: string) => {
    const config = {
      headers: { 'Authorization': `Bearer ${token}`}
    };

    const response = await api.get('/profile', config);
    return response.data
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.get('/logout')
    return response.data;
  }
})