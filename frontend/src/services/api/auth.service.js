import apiClient from './apiClient';

/**
 * Serviço de Autenticação
 * Gerencia login, logout e operações de autenticação
 */
const authService = {

    /**
     * Realiza login
     */
    async login(username, password) {
        const response = await apiClient.post('/auth/login', { username, password });

        // Salva token e usuário no localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        if (response.data.usuario) {
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }

        return response.data;
    },

    /**
     * Realiza logout
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/';
    },

    /**
     * Verifica se está autenticado
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Obtém token atual
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Obtém usuário atual
     */
    getCurrentUser() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    },

    /**
     * Registra novo usuário
     */
    async register(dadosUsuario) {
        const response = await apiClient.post('/auth/register', dadosUsuario);

        // Salva token e usuário se o registro retornar autenticação
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        if (response.data.usuario) {
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }

        return response.data;
    },

    /**
     * Solicita recuperação de senha
     */
    async forgotPassword(email) {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Reseta senha com token
     */
    async resetPassword(token, novaSenha) {
        const response = await apiClient.post('/auth/reset-password', {
            token,
            novaSenha
        });
        return response.data;
    }
};

export default authService;
