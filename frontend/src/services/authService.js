import api from './api';

const authService = {
    // Login
    login: async (username, password) => {
        const response = await api.post('/login', { username, password });

        if (response.data.ok && response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }

        return response.data;
    },

    // Logout
    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
        }
    },

    // Verificar se está autenticado
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Obter usuário atual
    getCurrentUser: () => {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    },
};

export default authService;
