import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

// Account API
export const accountAPI = {
  getAll: async () => {
    const response = await apiClient.get('/accounts');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/accounts/${id}`);
    return response.data;
  },
  create: async (accountData: any) => {
    const response = await apiClient.post('/accounts', accountData);
    return response.data;
  },
  update: async (id: string, accountData: any) => {
    const response = await apiClient.put(`/accounts/${id}`, accountData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/accounts/${id}`);
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },
  create: async (transactionData: any) => {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  },
  update: async (id: string, transactionData: any) => {
    const response = await apiClient.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default apiClient;

