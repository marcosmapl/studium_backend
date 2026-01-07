import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.STUDIUM_BACKEND_API_URL || 'http://localhost:3333/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Métodos de usuário
export const createUsuario = (dadosUsuario) => {
    const endpoint = import.meta.env.STUDIUM_BACKEND_API_USUARIO_ENDPOINT || '/usuario';
    return api.post(endpoint, dadosUsuario);
};

// Métodos para dados de cadastro
export const getGeneros = () => api.get('/generoUsuario');
export const getUnidadesFederativas = () => api.get('/unidadeFederativa');
export const getGruposUsuario = () => api.get('/grupoUsuario');
export const getSituacoesUsuario = () => api.get('/situacaoUsuario');
export const getCidadesByUF = (ufId) => api.get(`/cidade/uf/${ufId}`);

export default api;
