import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para evitar múltiples verificaciones simultáneas
let isCheckingInstance = false;

// Verificar si el servidor se reinició (instanceId cambió)
const verifyInstanceId = async () => {
  if (isCheckingInstance) return;
  isCheckingInstance = true;

  try {
    const { data } = await axios.get(`${api.defaults.baseURL}/status`);
    const storedId = localStorage.getItem('instanceId');

    if (storedId && storedId !== data.instanceId) {
      // Servidor se reinició - limpiar todo y redirigir
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
      return;
    }

    localStorage.setItem('instanceId', data.instanceId);
  } catch {
    // Si no puede conectar, probablemente el servidor está caído
    console.warn('No se pudo verificar instanceId del servidor');
  } finally {
    isCheckingInstance = false;
  }
};

// Verificar instanceId al hacer requests (máximo una vez por sesión)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Verificar instanceId solo si no se ha verificado en esta sesión
  if (!sessionStorage.getItem('instanceChecked')) {
    sessionStorage.setItem('instanceChecked', 'true');
    verifyInstanceId();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
