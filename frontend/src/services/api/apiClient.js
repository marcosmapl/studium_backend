import axios from 'axios';
import { APP_CONFIG } from '../../config/app.config';

/**
 * Cliente Axios configurado
 * Base para todos os serviços de API
 */
const apiClient = axios.create({
    baseURL: APP_CONFIG.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos
});

/**
 * Interceptor de requisição
 * Adiciona token e logging
 */
apiClient.interceptors.request.use(
    (config) => {
        // Adiciona token de autenticação
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

/**
 * Interceptor de resposta
 * Trata erros comuns e logging
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Tratamento de erros HTTP
        const status = error.response?.status;
        const url = error.config?.url;
        const method = error.config?.method?.toUpperCase();

        // Tratamento específico por status
        switch (status) {
            case 401:
                // Não autorizado - limpa sessão e redireciona
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                window.location.href = '/';
                break;

            case 403:
            case 404:
            case 422:
            case 500:
            case 502:
            case 503:
            default:
        }

        return Promise.reject(error);
    }
);

export default apiClient;
